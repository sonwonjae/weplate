import type { Database } from '@package/types';

import { readFile } from 'node:fs/promises';
import * as path from 'node:path';

import { createClient } from '@supabase/supabase-js';

const main = async () => {
  const file = await readFile(path.join(__dirname, './foodList.csv'), {
    encoding: 'utf-8',
  });

  if (typeof file !== 'string') {
    throw new Error('파일 양식이 잘못되었습니다.');
  }

  const foodListInScript = file.split('\r\n').map((str) => {
    const [foodName, cuisineList] = str
      .split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/)
      .map((item) => {
        return item.trim().replace(/"/g, '');
      });

    return {
      foodName,
      cuisineList: cuisineList.split(', '),
    };
  });
  const cuisineListInScript = [
    ...new Set(
      foodListInScript.flatMap(({ cuisineList }) => {
        return cuisineList;
      }),
    ),
  ];

  const foodListSet = new Set(
    foodListInScript.map(({ foodName }) => {
      return foodName;
    }),
  );
  const duplicatedFoodNameList = [
    ...new Set(
      foodListInScript.filter(({ foodName }) => {
        if (foodListSet.has(foodName)) {
          foodListSet.delete(foodName);
          return false;
        } else {
          return true;
        }
      }),
    ),
  ]
    .map(({ foodName }) => {
      return foodName;
    })
    .join(', ');

  if (duplicatedFoodNameList.length) {
    throw new Error(
      `[${duplicatedFoodNameList}]가 리스트 내에 중복되어 있습니다.`,
    );
  }

  const supabase = createClient<Database>(
    process.env.SUPABASE_URL as string,
    process.env.SUPABASE_ANON_KEY as string,
  );

  /** 1. cuisine 검증 및 추가 */
  const { data: cuisineListInDB } = await supabase.from('cuisine').select('*');
  const preCuisineList = cuisineListInScript.filter((cuisine) => {
    return !cuisineListInDB?.find(({ name: cuisineName }) => {
      return cuisineName === cuisine;
    });
  });
  if (preCuisineList.length) {
    await supabase.from('cuisine').insert(
      preCuisineList.map((cuisine) => {
        return { name: cuisine };
      }),
    );
  }
  const { data: finalCuisineListInDB } = await supabase
    .from('cuisine')
    .select('*');

  if (!Array.isArray(finalCuisineListInDB)) {
    throw new Error('finalCuisineListInDB가 잘못 불러와졌습니다.');
  }

  /** 2. foods 검증 및 추가 */
  const { data: foodListInDB } = await supabase.from('foods').select('*');

  const preFoodList = foodListInScript.filter(({ foodName: food }) => {
    return !foodListInDB?.find(({ name: foodName }) => {
      return foodName === food;
    });
  });

  if (!preFoodList.length) {
    return;
  }

  const createdAt = new Date().toISOString();
  const updatedAt = new Date().toISOString();

  const { data: AddedFoodListInDB } = await supabase
    .from('foods')
    .insert(
      preFoodList.map(({ foodName }) => {
        return {
          name: foodName,
          createdAt,
          updatedAt,
        };
      }),
    )
    .select('*');

  if (!Array.isArray(AddedFoodListInDB)) {
    throw new Error('AddedFoodListInDB가 추가되지 않았습니다.');
  }

  await supabase.from('food__cuisine').insert(
    AddedFoodListInDB.flatMap((food) => {
      const { cuisineList } =
        preFoodList.find(({ foodName }) => {
          return foodName === food.name;
        }) || {};

      if (!Array.isArray(cuisineList)) {
        throw new Error(`${food.name}에 해당하는 cuisineList가 없습니다.`);
      }
      const cuisineListWithDB = cuisineList.map((cuisineName) => {
        const cuisine = finalCuisineListInDB.find((cuisine) => {
          return cuisineName === cuisine.name;
        });
        if (!cuisine) {
          throw new Error(`${food.name}에 해당하는 ${cuisineName}이 없습니다.`);
        }
        return cuisine;
      });

      return cuisineListWithDB.map((cuisine) => {
        return {
          foodId: food.id,
          cuisineId: cuisine.id,
        };
      });
    }),
  );
};

main();

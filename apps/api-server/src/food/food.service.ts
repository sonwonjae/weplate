import { Injectable } from '@nestjs/common';
import { SupabaseService } from 'src/supabase/supabase.service';

import { SearchFoodListDto } from './dto/search-food-list.dto';

@Injectable()
export class FoodService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async searchFoodList({ search }: SearchFoodListDto) {
    let query = this.supabaseService.client.from('foods').select('*');

    if (search) {
      query = query.ilike('name', `%${search}%`);
    }

    const { data: foodList } = await query;

    return foodList ?? [];
  }
}

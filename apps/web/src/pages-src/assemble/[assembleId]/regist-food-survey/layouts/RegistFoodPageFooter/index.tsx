import MoveNextStep from "./MoveNextStep";
import MovePrevStep from "./MovePrevStep";
import RegistFood from "./RegistFood";
import StepFooter from "./StepFooter";
import SubmitFoodList from "./SubmitFoodList";

function RegistFoodPageFooter() {
  return (
    <StepFooter>
      <MoveNextStep />
      <RegistFood />
      <SubmitFoodList />
      <MovePrevStep />
    </StepFooter>
  );
}

export default RegistFoodPageFooter;

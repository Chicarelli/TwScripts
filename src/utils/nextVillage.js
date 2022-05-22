import { awaitForSelector } from "./awaitForSelector";

//[ ] For some reasons, there are some square Opened? Then close.
export async function nextVillage() {

  try {
    const isSquareOpen = document.querySelector("#popup_box_popup_command");

    if (isSquareOpen) {
      const closeButton = await awaitForSelector(".popup_box_close");
      closeButton.click();
      await awaitForSelectorToDisappear("#popup_box_popup_command");
    }

    const nextVillage = await awaitForSelector("#village_switch_right");
    nextVillage.click();
  } catch {
    window.location.reload();
  }

}
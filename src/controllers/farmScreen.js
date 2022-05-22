import { FarmController } from '../elements/FarmController';
import { awaitForSelector } from '../utils/awaitForSelector';
import { delay } from '../utils/delay';
import { nextVillage } from '../utils/nextVillage';
import { ScriptRunning } from '../models/ScriptRunning';
import { awaitForRecaptcha } from '../utils/awaitForRecaptcha';
import { awaitForSelectorToDisappear } from '../utils/awaitForSelectorToDisappear';

export const executeFarmScreen = async() => {
  let element;
  element = await awaitForSelector("#content_value");
  if (!element) {
    throw new Error("For some reason, the page content isn't loaded");
  }

  const scriptStatus = new ScriptRunning();
  const controller = new FarmController(startExecution, pauseExecution);
  
  let lightCavalryOnA;
  let lightCavalryOnB;

  try {
    lightCavalryOnA = await awaitForSelector("#content_value > div:nth-child(3) > div > form > table > tbody > tr:nth-child(2) > td:nth-child(8) > input[type=text]");
    lightCavalryOnB = await awaitForSelector("#content_value > div:nth-child(3) > div > form > table > tbody > tr:nth-child(4) > td:nth-child(8) > input[type=text]");
  } catch ( error ) {
    console.log(error);
    const hasRecaptcha = await awaitForRecaptcha(15);

    if (!hasRecaptcha) { //ocorreu erro porque se não tem recaptcha??
      window.location.reload();
      return;
    }

    try {
      const tribalwars = Tribalwars;
      //5x times.

      let timer;
      let counter = 0;

      timer = setInterval(() => {
        if (counter <= 5) {
          tribalwars?.playAttackSound();

        } else {
          clearInterval(timer);
        }
      }, 1000);
      
    }
    catch(error) { 
      console.log(error);
    }
    return;
  }
 
  lightCavalryOnA = lightCavalryOnA.value;
  lightCavalryOnA = Number(lightCavalryOnA);

  lightCavalryOnB = lightCavalryOnB.value;
  lightCavalryOnB = Number(lightCavalryOnB);

  //verificando quantidade de cavalarias leves. 
  let lightCavalryQuantity = await awaitForSelector("#light");

  lightCavalryQuantity = Number(lightCavalryQuantity.textContent);

  element.prepend(controller.getContainer());

  if (scriptStatus.isRunning) {
    startExecution();
  }

  async function startExecution() {
    scriptStatus.onStart();
    controller.onStart();

    let hasMoreThanOneVillage = false;
    try {
      await awaitForSelector("#village_switch_right");
      hasMoreThanOneVillage = true;
    } catch {
      hasMoreThanOneVillage = false;
    }

    const element = await awaitForSelector("#plunder_list > tbody");
  
    const numberOfChildrens = element.children.length;
    const lastNumber = hasMoreThanOneVillage ? numberOfChildrens > 40 ? 39 : numberOfChildrens : numberOfChildrens - 1;
    
    forController()
    .then(async () => {
      if (scriptStatus.isRunning) {
        await delay(400);
        return hasMoreThanOneVillage ? nextVillage() : window.location.reload()
      } 
      return;
    })
    
    async function forController() {
      return new Promise(async (resolve, reject) => {
        for (let i = 2; i < lastNumber; i++) {
          if (!scriptStatus.isRunning) {
            resolve();
            break;
          }
    
          const row = element.children[i];
    
          let secondCheckOnQuantity = document.querySelector("#light");
          secondCheckOnQuantity = secondCheckOnQuantity.innerHTML.replace(/\./g, '');
          secondCheckOnQuantity = Number(secondCheckOnQuantity);
          
          if (secondCheckOnQuantity < 2) {
            resolve();
            break;
          }
    
          if (lightCavalryQuantity < Number(lightCavalryOnA) && lightCavalryQuantity < Number(lightCavalryOnB)) {
            resolve();
            break;
          }
    
          await rowController(row);
          await delay(500);
        }
        resolve();
      })
    }
  }

  async function pauseExecution() {
    scriptStatus.onPause();
    controller.onPause();
  }

  async function rowController(row) {
    const wallLevel = row.children[6].innerHTML;

    if (isNaN(Number(wallLevel))) { //Send A. No info about the wall. 
      row.children[8].children[0].click();
      lightCavalryQuantity = lightCavalryQuantity - Number(lightCavalryOnA);
      return;
    }

    if (Number(wallLevel) > 0) {
      row.children[11].children[0].click();
      await awaitForSelector("#popup_box_popup_command");

      // #units_entry_all_ram
      const rams = document.getElementById("units_entry_all_ram").innerHTML.replace(/\D/g, '');
      const lightCavalry = document.getElementById("units_entry_all_light").innerHTML.replace(/\D/g, '');

      const necessaryRams = Number(wallLevel) * 3 + Number(wallLevel);
      const necessaryLightCavalry = Number(wallLevel) * 3;

      if ((Number(rams) < necessaryRams) || (Number(lightCavalry) < necessaryLightCavalry)) {
        const closeButton = await awaitForSelector(".popup_box_close");
        closeButton.click();
        return;
      }
      
      const lightCavalryInput = document.getElementById("unit_input_light");
      const ramsInput = document.getElementById("unit_input_ram");

      lightCavalryInput.value = necessaryLightCavalry;
      ramsInput.value = necessaryRams;

      const attackButton = document.getElementById("target_attack");
      attackButton.click();

      const confirmAttack = await awaitForSelector("#troop_confirm_submit");
      confirmAttack.click();
      lightCavalryQuantity = lightCavalryQuantity - necessaryLightCavalry;
      await awaitForSelectorToDisappear("#popup_box_popup_command")
      return;
    }

    const isPrevFarmFull = row.children[2].children[0].src.indexOf('max_loot/1.png') >= 0 ? true : false;

    //Se não tiver sido full, mandar ataque A.
    if (!isPrevFarmFull) {
      row.children[8].children[0].click();
      lightCavalryQuantity = lightCavalryQuantity - Number(lightCavalryOnA);
      return;
    }

    //pegar total de recursos pra ver se manda 15 cavalarias leves ou menos de 15.
    const totalResources = Object.values(row.children[5].children).reduce((acc, children) => {
      let span = children;

      let totalResources = span.children[1].textContent;
      totalResources = Number(totalResources.replace(/\./g, ''));

      return acc + totalResources;
    }, 0);

    if (totalResources > 1000) { // mandar B. Tem bastante recursos
      row.children[9].children[0].click();
      lightCavalryQuantity = lightCavalryQuantity - Number(lightCavalryOnB);
    }  else {
      row.children[8].children[0].click(); //mandar A mesmo. Não compensa gastar 15 cavalarias aqui (no 112.)
      lightCavalryQuantity = lightCavalryQuantity - Number(lightCavalryOnA)
    }
    return;
  }

};


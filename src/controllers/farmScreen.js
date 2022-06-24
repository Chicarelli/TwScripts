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

  awaitForRecaptcha()
  .then(element => {
    let audioElement = "<audio id='audio' autoplay><source src='http://protettordelinks.com/wp-content/baixar/bomba_relogio_alerta_www.toquesengracadosmp3.com.mp3' type='audio/mp3' /></audio>";

    document.body.appendChild(audioElement);
  })
  .catch(error => {
    console.log('nr')
    window.location.reload();
  });

  const scriptStatus = new ScriptRunning();
  const controller = new FarmController(startExecution, pauseExecution);
  
  let lightCavalryOnA;
  let lightCavalryOnB;

  try {
    lightCavalryOnA = await awaitForSelector("#content_value > div:nth-child(5) > div > form > table > tbody > tr:nth-child(2) > td:nth-child(7) > input[type=text]");
    lightCavalryOnB = await awaitForSelector("#content_value > div:nth-child(5) > div > form > table > tbody > tr:nth-child(4) > td:nth-child(7) > input[type=text]");
  } catch ( error ) {
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
      }).catch(error =>
        { 
          console.log(err);

          setTimeout(() => {
            window.reload();
          }, 10000)
        });
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
      const barbaros = document.getElementById("units_entry_all_axe").innerHTML.replace(/\D/g, '');

      const necessaryRams = Number(wallLevel) * 3 + Number(wallLevel);
      const necessaryBarbaros = 50;

      if ((Number(rams) < necessaryRams) || (Number(barbaros) < necessaryBarbaros)) {
        const closeButton = await awaitForSelector(".popup_box_close");
        closeButton.click();
        return;
      }
      
      const barbarosInput = document.getElementById("unit_input_axe");
      const ramsInput = document.getElementById("unit_input_ram");

      barbarosInput.value = necessaryBarbaros;
      ramsInput.value = necessaryRams;
      
      await delay(300);

      const attackButton = document.getElementById("target_attack");
      attackButton.click();

      await delay(300);
      
      const confirmAttack = await awaitForSelector("#troop_confirm_submit");
      confirmAttack.click();

      await awaitForSelectorToDisappear("#popup_box_popup_command");
      await delay(100);
      return;
    }

    let isPrevFarmFull = false;
    try {
      isPrevFarmFull = row.children[2].children[0].src.indexOf('max_loot/1.png') >= 0 ? true : false;
    }
    catch (error) {
      isPrevFarmFull = false;
    }

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

    if (totalResources > 5000) {
      console.log('new feature');
      //add custom attack to farm all possible resources. 
      let necessaryCavalry =  Math.floor((totalResources * 0.7) / 80); 



      if (necessaryCavalry < 20) {
        necessaryCavalry = 20;
      }

      row.children[11].children[0].click();
      await awaitForSelector("#popup_box_popup_command");
      
      await delay(300);

      const light = document.getElementById('units_entry_all_light').innerHTML.replace(/\D/g, '');
      const spy = document.getElementById('units_entry_all_spy').innerHTML.replace(/\D/g, '');
      const heavy = document.getElementById('units_entry_all_heavy').innerHTML.replace(/\D/g, '');


      if (Number(heavy) > 20) {

        let necessaryHeavy = Math.floor((totalResources * .7) / 50);

        if (necessaryHeavy < 20) {
          necessaryHeavy = 20;
        }

          let heavyToInput = heavy < necessaryHeavy ? heavy : necessaryHeavy;
          if (heavyToInput > 150) {
            heavyToInput = 200;
          }

          const spyInput = document.getElementById('unit_input_spy');
          const heavyInput = document.getElementById('unit_input_heavy');

          if (Number(spy) >= 1) {
            spyInput.value = 1;
          }

          heavyInput.value = Math.floor(heavyToInput);
          await delay (300);

          const attackButton = document.getElementById("target_attack");
          attackButton.click();
    
          await delay(300);
          
          const confirmAttack = await awaitForSelector("#troop_confirm_submit");
          confirmAttack.click();
    
          await awaitForSelectorToDisappear("#popup_box_popup_command");
          await delay(100);
          return;
      }

      if (Number(light) < Math.floor((necessaryCavalry / 2)) && light < 20) {
        const closeButton = await awaitForSelector(".popup_box_close");
        closeButton.click();
        await delay(300)
        return;
      }

      let lightToInput = light < necessaryCavalry ? light : necessaryCavalry;

      if (Number(lightToInput) > 300) {
        lightToInput = MathFloor(Number(lightToInput) * .8);
      }

      if (Number(lightToInput) > 300) {
        lightToInput = 300;
      }

      const spyInput = document.getElementById('unit_input_spy');
      const lightInput = document.getElementById('unit_input_light');

      if ( spy >= 1 ) {
        spyInput.value = 1;
      } 

      lightInput.value = Math.floor(lightToInput);

      await delay (300);

      const attackButton = document.getElementById("target_attack");
      attackButton.click();

      await delay(300);
      
      const confirmAttack = await awaitForSelector("#troop_confirm_submit");
      confirmAttack.click();

      await awaitForSelectorToDisappear("#popup_box_popup_command");
      await delay(100);
      return;
    }

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


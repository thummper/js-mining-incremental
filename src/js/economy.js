import * as helper from "../js/helper.js";
import Graph from "../js/graph.js";
/* 
    Economy class should observe supply and control ingot demand with simple factors
    The Economy class will also house the competition companies 


    Normal Tick: 
        Ingot prices should update,
        Competition companies should operate

    Special Tick:
        Ingot price targets should change based on supply / demand
        Condition of the economy should change 
        Supply & Demand should change
        Companies may pay dividends / Release sales figures



*/
export default class Economy{
    constructor(){
        this.orePrices    = [25, 50, 100, 250];
        this.ingotPrices  = [50, 100, 200, 500];
        this.ingotTargets = [50, 100, 200, 500];
        this.outlook = 0.8;
        // Real Estate Indexs
        this.landIndGraph = new Graph("area");
        this.currentLandIndex = 0;
        this.historicLandIndex = [];
    }



    updateLandIndex(land, time){
        let counter = 0;
        for(let i = 0; i < land.length; i++){
            counter += land[i].value;
        }
        // Index counts average land price. 
        counter = Math.round(counter / land.length);
        // Counter is current land index
        this.currentLandIndex = counter; 
        // Push counter and data to historic for graphing

        this.historicLandIndex.push([time, counter]);

        while(this.historicLandIndex.length > 100){
            this.historicLandIndex.shift();
        }
        // Cant call this
        this.landIndGraph.update(this.historicLandIndex);
    }

  
    landPrice(land){
        /* 
        TODO: 

        Land price should be based on a general market value (depending on tier of land), and should also depend on 
        on the amount of ore the land will provide you with. 

        Land price should also take into account whether it has been developed or not (as building mines takes time and is expensive)
        
        */
        let basePrice = helper.randomNumber(500000, 2000000, 0);
        this.landUpdate(land);
        land.basePrice = basePrice;
        land.developPrice = Math.floor(basePrice / (land.tier + 1));
    }

    landUpdate(land){
        // Given a piece of land, adjust price based on economy, and work out its value.

        let economyFactor = 0;
        

        if(this.outlook >= 0){
            economyFactor = (land.basePrice * 0.2) * helper.randomNumber(0.008, 0.015, 0);
            land.basePrice += economyFactor;
            // If we own the land, this value needs to be added to accounting info (appreciation    )
        }
        //Update price of land based on ores.
        let oreValue = 0;
        let ores = land.ores;
        let orePrices = this.orePrices;
        
        for(let i = 0; i < ores.length; i++){
            let amount = ores[i];
            let value  = orePrices[i] * 0.03;
            let worth = amount * value;
            oreValue += worth;
        }
        land.oreWorth = oreValue;
        land.value = land.basePrice + land.oreWorth;
        if(land.developed){
       
            land.value =  land.value * land.developedModifier;
        }
        return economyFactor;
    }


}
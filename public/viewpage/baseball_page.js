import * as Elements from './elements.js'
import { routePath } from '../controller/route.js';
import { unauthorizedAccess } from './unauthorized_access_message.js';
import { currentUser } from '../controller/firebase_auth.js';
import { info } from './util.js';
import { addBaseBallGameHistory, getBaseBallGameHistory } from '../controller/firestore_controller.js';



export function addEventListeners() {
    
    Elements.menus.baseball.addEventListener('click', () => {
        history.pushState(null,null, routePath.BASEBALL);
        baseball_page();

    });
}
export async function baseball_page() {
    if (!currentUser){
        Elements.root.innerHTML = unauthorizedAccess();
        return;
    }
    
    let html;
    const response = await fetch('/viewpage/templates/baseball_page.html', { cache: 'no-store'});
    html = await response.text();
    Elements.root.innerHTML = html;
    testUpdater();
    var buttons = [];
    for(let i = 0;i <=9; i++) {
        buttons.push(document.getElementById(`button-${i}`));
    }
    detectButton(buttons);
    document.getElementById('button-new-game-baseball').addEventListener('click', newgamelist);
    document.getElementById('button-new-game-baseball').disabled = true;

    document.getElementById('button-history').addEventListener('click',bthhistory);

}

async function bthhistory(event){
    let history;
    try {
        history = await getBaseBallGameHistory(currentUser.email);
        let html = `
            <table class="table table-success table-striped">
            <br>
            <tr><th>Attempts</th><th>Date</th></tr>
            <body>
        `;
        for (let i = 0; i < history.length; i++) {
            html += `
            <tr>
            <td>
                ${history[i].noa}
            </td>
            <td>
            ${new Date(history[i].timestamp).toLocaleString()}
            </td>
            </tr>
            
            `;
        }
        html += '</body></table>';
        document.getElementById('history').innerHTML = html;

        

    } catch (e) {
       //if (DEV) console.log('ERROR; history button', e);
       info('Failed to get game history', JSON.stringify(e));
    }
}

function newgamelist(event){
    baseball_page();
}

function detectButton(buttons) {
    for(let i=0;i<=9;i++) {
        buttons[i].addEventListener('click', btnlisnum);
    }
}

let strike=0,ball=0,attempt=0;
let guessnum= []
async function btnlisnum(event){
    document.getElementById(event.target.id).disabled = true;
    console.log(event.target.id);
    let gusn= "" + event.target.id
    gusn = gusn.charAt(gusn.length-1);
    if(guessnum.length>0){
        document.getElementById('moves').innerHTML += ",";
    }
    guessnum.push(parseInt(gusn));
    document.getElementById('moves').innerHTML += gusn;
    if(guessnum.length==3){
        attempt++;
        console.log(num + " , " + guessnum);
        if(guessnum[0]==num[0]&&guessnum[1]==num[1]&&guessnum[2]==num[2]){
            console.log("Winner");
            document.getElementById('button-new-game-baseball').disabled = false;


            document.getElementById('history').innerHTML += "<br> {Struck out --- after "+attempt+" attempts}";

            info("Game Over", `Struck out after ${attempt} attempts`);

            const gamePlay = {
                email: currentUser.email,
                noa: attempt,
                timestamp: Date.now(),
            };
            try {
                await addBaseBallGameHistory(gamePlay);
                attempt=0;
                //info('Game Over', gameModel.status);
            } catch (e) {
                //info('Game Over', `Failed to save the game play history: ${e}`);
                if (DEV) console.log('Game Over: failed to save:', e);
            }
            
            for (let index = 0; index < 10; index++) {
                document.getElementById(`button-${index}`).disabled = true;
                
            }

        }else{
            if(guessnum[0]==num[0]){
                strike++;
            }
            else {
                if(guessnum[0]==num[1]||guessnum[0]==num[2]){
                    ball++;
                }
            }
            if(guessnum[1]==num[1]){
                strike++;
            }
            else {
                if(guessnum[1]==num[0]||guessnum[1]==num[2]){
                    ball++;
                }
            }
            if(guessnum[2]==num[2]){
                strike++;
            }
            else {
                if(guessnum[2]==num[0]||guessnum[2]==num[1]){
                    ball++;
                }
            }
            document.getElementById('history').innerHTML += "<br> ["+ attempt+"] Guess: "+guessnum[0]+","+guessnum[1]+","+guessnum[2]+" B#: "+ball+" S#: "+strike;
            console.log(ball+","+strike);
            for (let index = 0; index < 10; index++) {
                document.getElementById(`button-${index}`).disabled = false;
                
            }
            
        }
        ball=0;strike=0;
        guessnum.pop();
        guessnum.pop();
        guessnum.pop();
        document.getElementById('moves').innerHTML = "";
        
    }            
}

let num=[];

function testUpdater() {
    let randomValueTest = document.getElementById('randomValue');
    
    num[0]= Math.floor(Math.random() * 10);
    num[1] = Math.floor(Math.random() * 10);
    num[2] = Math.floor(Math.random() * 10);

    while(num[0] == num[1]) {
        num[1]= Math.floor(Math.random() * 10);
    }
    while((num[1] == num[2]) || (num[2] == num[0])) {
        num[2] = Math.floor(Math.random() * 10);
    }
    //let num2 = Math.floor(Math.random() * 10);
    //let num3 = Math.floor(Math.random() * 10);
    randomValueTest.innerHTML = `
    ${num[0]},${num[1]},${num[2]}
    `;

    
}

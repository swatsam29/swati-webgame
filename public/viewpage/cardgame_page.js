import * as Elements from './elements.js'
import { routePath } from '../controller/route.js';
import { unauthorizedAccess } from './unauthorized_access_message.js';
import { currentUser } from '../controller/firebase_auth.js';
import { info } from './util.js';
import { marking } from '../model/card_game.js'
import { addCardGameHistory, getCardGameHistory, getTicTacToeGameHistory } from '../controller/firestore_controller.js';
import { DEV } from '../model/constants.js';

let totalbalance = 8;
let current_bet = 0;
let curr_debt = 0;
let gamekey = 0;
let loan = false;

let current_value_element = document.getElementById('current_value');
export function addEventListeners() {
    Elements.menus.card.addEventListener('click', () => {
        history.pushState(null, null, routePath.CARD);
        card_page();
    });
}
const imageSource = {
    Blank: '/images/blank.png',
    Logo: '/images/logo.png',
    Card: '/images/card.png',
};
export async function card_page() {
    if (!currentUser) {
        Elements.root.innerHTML = unauthorizedAccess();
        return;
    }
    let html;
    const response = await fetch('/viewpage/templates/cardgame_page.html', { cache: 'no-store' });
    html = await response.text();
    Elements.root.innerHTML = html;
    gamekey = valuegenrator();
    balance();
    //newgame();
    document.getElementById('card1-text').disabled = true;
    document.getElementById('card2-text').disabled = true;
    document.getElementById('card3-text').disabled = true;
    document.getElementById('button1-minus').addEventListener('click', clickminus1);
    document.getElementById('button2-minus').addEventListener('click', clickminus2);
    document.getElementById('button3-minus').addEventListener('click', clickminus3);
    document.getElementById('button1-add').addEventListener('click', clickadd1);
    document.getElementById('button2-add').addEventListener('click', clickadd2);
    document.getElementById('button3-add').addEventListener('click', clickadd3);
    document.getElementById('button-play-game-card').disabled = true;
    document.getElementById('button-new-game-card').disabled = true;
    document.getElementById('button-play-game-card').addEventListener('click', letsplay);
    document.getElementById('button-new-game-card').addEventListener('click', newgame);
    document.getElementById('button-loan-coins-card').addEventListener('click', loanCoins);
    document.getElementById('button-history').addEventListener('click', gamehistory);
    let history;
        try {
            history = await getCardGameHistory(currentUser.email);
            totalbalance=history[0].balance;
            curr_debt=history[0].debts;
            document.getElementById('balance').innerHTML = "Balance: " + totalbalance;
            document.getElementById('deb').innerHTML = "(Debts: " + curr_debt + ")";


        } catch (e) {
            //info('Game Over', `Failed to save the game play history: ${e}`);
            if (DEV) console.log('Game Over: failed to get:', e);
        }

}
async function letsplay(event) {
    let n = 0;
    if (gamekey == 0) {
        n = document.getElementById('card1-text').value;
        n = n * 3;
        totalbalance = totalbalance + n;
        totalbalance = totalbalance - current_bet;
        document.getElementById('balance').innerHTML = "Balance: " + totalbalance;
        document.getElementById('image-0').src = '/images/logo.png';
        document.getElementById('image-1').src = '/images/blank.png';
        document.getElementById('image-2').src = '/images/blank.png';
    } else if (gamekey == 1) {
        n = document.getElementById('card2-text').value;
        n = n * 3;
        totalbalance = totalbalance + n;
        totalbalance = totalbalance - current_bet;
        document.getElementById('balance').innerHTML = "Balance: " + totalbalance;
        document.getElementById('image-0').src = '/images/blank.png';
        document.getElementById('image-1').src = '/images/logo.png';
        document.getElementById('image-2').src = '/images/blank.png';
    } else if (gamekey == 2) {
        n = document.getElementById('card3-text').value;
        n = n * 3;
        totalbalance = totalbalance + n;
        totalbalance = totalbalance - current_bet;
        document.getElementById('balance').innerHTML = "Balance: " + totalbalance;
        document.getElementById('image-0').src = '/images/blank.png';
        document.getElementById('image-1').src = '/images/blank.png';
        document.getElementById('image-2').src = '/images/logo.png';
    }
    const gamePlay = {
        email: currentUser.email,
        balance: totalbalance,
        bets: current_bet,
        debts: curr_debt,
        loan: loan,
        timestamp: Date.now(),
        won: n,
    };
    try {
        await addCardGameHistory(gamePlay);

        //info('Game Over', gameModel.status);
    } catch (e) {
        //info('Game Over', `Failed to save the game play history: ${e}`);
        if (DEV) console.log('Game Over: failed to save:', e);
    }
    document.getElementById('transactions').innerHTML = `You won ${n} by betting ${current_bet} coins <br> Game results are stored in Firebase`;
    document.getElementById('button-play-game-card').disabled = true;
    document.getElementById('button-new-game-card').disabled = false;
    current_bet = 0;

}

function newgame(event) {
    card_page();
}

function endisplay() {
    if (current_bet > 0) {
        document.getElementById('button-play-game-card').disabled = false;
    } else {
        document.getElementById('button-play-game-card').disabled = true
    }
}
function clickadd1(event) {
    if (current_bet < totalbalance) {
        let x = parseInt(document.getElementById('card1-text').value);
        x = x + 1;
        document.getElementById('card1-text').value = x;
        console.log(x);
        current_bet++;
        document.getElementById('current_value').innerHTML = "Current Bets: " + current_bet;

    }
    endisplay();
    // loanCoins();
    //newgame();
}
function clickminus1(event) {
    let x = parseInt(document.getElementById('card1-text').value);
    if (x > 0) {
        x = x - 1;
        document.getElementById('card1-text').value = x;
        console.log(x);

        current_bet--;
        document.getElementById('current_value').innerHTML = "Current Bets: " + current_bet;

    }
    endisplay();
    // loanCoins();
    //newgame();
}
function clickadd2(event) {
    if (current_bet < totalbalance) {
        let x = parseInt(document.getElementById('card2-text').value);
        x = x + 1;
        document.getElementById('card2-text').value = x;
        console.log(x);

        current_bet++;
        document.getElementById('current_value').innerHTML = "Current Bets: " + current_bet;
    }
    endisplay();
    // loanCoins();
    //newgame();
}
function clickminus2(event) {
    let x = parseInt(document.getElementById('card2-text').value);
    if (x > 0) {
        x = x - 1;
        document.getElementById('card2-text').value = x;
        console.log(x);

        current_bet--;
        document.getElementById('current_value').innerHTML = "Current Bets: " + current_bet;
    }
    endisplay();
    //newgame();
}
function clickadd3(event) {
    if (current_bet < totalbalance) {
        let x = parseInt(document.getElementById('card3-text').value);
        x = x + 1;
        document.getElementById('card3-text').value = x;
        console.log(x);
        current_bet++;
        document.getElementById('current_value').innerHTML = "Current Bets: " + current_bet;
    }
    endisplay();
    //newgame();
}
function clickminus3(event) {
    let x = parseInt(document.getElementById('card3-text').value);
    if (x > 0) {
        x = x - 1;
        document.getElementById('card3-text').value = x;
        console.log(x);
        current_bet--;
        document.getElementById('current_value').innerHTML = "Current Bets: " + current_bet;
    }
    endisplay();
    //newgame();
}
let num = [];

function valuegenrator() {
    let randomValueTest = document.getElementById('randomValue');
    num[0] = Math.floor(Math.random() * 3);
    randomValueTest.innerHTML = `
    SECRET: Firebase card location:
     ${num[0]}
    `;
    return num[0];
}
function balance() {
    document.getElementById('balance').innerHTML += totalbalance;
    document.getElementById('deb').innerHTML = "(Debts: " + curr_debt + ")";


}
async function loanCoins(event) {

    if (totalbalance == 0) {
        info("Loan Complete", 'You borrowed 8 Coins');
        totalbalance = totalbalance + 8;
        document.getElementById('balance').innerHTML = "Balance:" + totalbalance;
        curr_debt = curr_debt + 8;
        document.getElementById('deb').innerHTML = "(Debts: " + curr_debt + ")";
        loan = true;
        const gamePlay = {
            email: currentUser.email,
            balance: totalbalance,
            debts: curr_debt,
            loan: loan,
            timestamp: Date.now(),
        };
        try {
            await addCardGameHistory(gamePlay);
    
            //info('Game Over', gameModel.status);
        } catch (e) {
            //info('Game Over', `Failed to save the game play history: ${e}`);
            if (DEV) console.log('Game Over: failed to save:', e);
        }
        loan = false;
    } else {
        info("Not available", 'Loan available when your balance is 0');
    }
}

async function gamehistory(event){
        let history;
        try {
            history = await getCardGameHistory(currentUser.email);
            let html = `
                <table class="table table-success table-striped">
                <br>
            `;
            for (let i = 0; i < history.length; i++) {
                if(history[i].loan==false){
                    html += `
                    <tr>
                    <td>
                    (${new Date(history[i].timestamp).toLocaleString()}) <br>
                    Balance = ${history[i].balance} Debt = ${history[i].debts} : BET ${history[i].bets}, WON ${history[i].won} coins
                    </td>
                    </tr>
                    
                    `;
                }else{
                    html += `
                    <tr>
                    <td>
                    (${new Date(history[i].timestamp).toLocaleString()}) <br>
                    Balance = ${history[i].balance} Debt = ${history[i].debts} : Borrowed 8 coins
                    </td>
                    </tr>
                    
                    `;
                }
                
            }
            html += '</table>';
            document.getElementById('transactions').innerHTML = html;
    
        } catch (e) {
           if (DEV) console.log('ERROR; history button', e);
           info('Failed to get game history', JSON.stringify(e));
        }
    }







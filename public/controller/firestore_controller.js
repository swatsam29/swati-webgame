import { getFirestore, collection, addDoc, query, where, orderBy, getDocs } from "https://www.gstatic.com/firebasejs/9.9.3/firebase-firestore.js"

const db = getFirestore();

const TicTacToeGameCollection = 'tictactoe_game';
const BaseBallGameCollection = 'baseball_game';


export async function addTicTacToeGameHistory(gamePlay) {
    //gamePlay = {email, winner, moves, timestamp}
    await addDoc(collection(db, TicTacToeGameCollection), gamePlay);
}

export async function getTicTacToeGameHistory(email) {
    let history= [];
    const q = query(
        collection(db, TicTacToeGameCollection),
        where('email','==', email),
        orderBy('timestamp','desc'),
    );
const snapShot = await getDocs(q);
snapShot.forEach( doc => {
    const {email, winner, moves, timestamp } = doc.data();
    history.push({email, winner, moves, timestamp});
});
return history;
}

export async function addBaseBallGameHistory(gamePlay) {
    //gamePlay = {email, winner, moves, timestamp}
    await addDoc(collection(db, BaseBallGameCollection), gamePlay);
}

export async function getBaseBallGameHistory(email) {
    let history= [];
    const q = query(
        collection(db, BaseBallGameCollection),
        where('email','==', email),
        orderBy('timestamp','desc'),
    );
const snapShot = await getDocs(q);
snapShot.forEach( doc => {
    const {email, noa, timestamp } = doc.data();
    history.push({email, noa, timestamp});
});
return history;
}
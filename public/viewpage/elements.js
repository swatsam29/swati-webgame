export const root = document.getElementById('root');
export const modalInfobox = {
    modal: new bootstrap.Modal(document.getElementById('modal-infobox'), {backdrop: 'static'}),
    tittle: document.getElementById('modal-infobox-tittle'),
    body: document.getElementById('modal-infobox-body')
}

export const modalSignin = new bootstrap.Modal(document.getElementById('modal-signin-form'),{backdrop: 'static'});
export const formSignin = document.getElementById('form-signin');
export const baseBallNewGameButton = document.getElementById('button-new-game-baseball');
export const whichButtonPressed = document.getElementById('button-00');
export const modalpreauthElements = document.getElementsByClassName('modal-preauth');
export const modalpostauthElements = document.getElementsByClassName('modal-postauth');
export const randomValueElement = document.getElementById('randomValue');

export const menus = {
    signIn : document.getElementById('menu-signin'),
    tictactoe : document.getElementById('menu-tictactoe'),
    baseball : document.getElementById('menu-baseball'),
    card : document.getElementById('menu-card'),
    about : document.getElementById('menu-about'),
    signOut : document.getElementById('menu-signout'),
}
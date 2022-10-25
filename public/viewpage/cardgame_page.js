import * as Elements from './elements.js'
import { routePath } from '../controller/route.js';
import { unauthorizedAccess } from './unauthorized_access_message.js';
import { currentUser } from '../controller/firebase_auth.js';

export function addEventListeners() {

    Elements.menus.card.addEventListener('click', () => {
        history.pushState(null,null, routePath.CARD);
        card_page();

    });
}
export function card_page() {
    if (!currentUser){
        Elements.root.innerHTML = unauthorizedAccess();
        return;
    }
    
    let html = 'Card Game Page' ;
    Elements.root.innerHTML = html ;
}
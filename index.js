var link = "https://min-api.cryptocompare.com/data/pricemultifull?fsyms=BTC,ETH,BNB,SOL,AID,CAG,DOV&tsyms=USD";

var menu_button = document.querySelector("#menu_button");
var menu = document.querySelector('#menu');
document.addEventListener("DOMContentLoaded", documentLoad);
menu_button.addEventListener('click', ()=>{ menu.classList.toggle("menu-open") });

var display_coin = document.querySelector("#display-coin");
var logo_coin = display_coin.querySelector("#logo");
var title_coin = display_coin.querySelector("#title");
var price_coin = display_coin.querySelector("#price");

var checkbox = document.getElementById('interval_check_box');

checkbox.addEventListener('change', function() {
    if (checkbox.checked) {
        // Start setInterval when checkbox is checked
        refresh()
        intervalId = setInterval(() => {
            refresh();
        }, 10000);
    } else {
        // Clear setInterval when checkbox is unchecked
        clearInterval(intervalId);
    }
});

var template_menu_coin = document.querySelector("#template-menu-coin")

var crypto_list = null
try{
 crypto_list = JSON.parse(localStorage.getItem("crypto_list"))
}
catch (e){
    crypto_list = []
}

var select_coin = null
try{
    select_coin = JSON.parse(localStorage.getItem("select_coin"))
    if(select_coin == null)
        throw new Error()
}
catch (e){
    select_coin = {
        title: "Catcoin",
        price: "Цена сравнима с ценой лабы по СиСъмОдЪу",
        img_url: "https://avatars.mds.yandex.net/get-entity_search/2487574/434829330/orig"
    }
}

async function getCryptoList(){
    let coins = undefined;
    try {
        coins = await fetch(link)
        .then(res => res.json())
        .then(data => {
            return data;
        })
        coins = coins.RAW;
    } catch (error) {
        return []
    }
    crypto_list = coins
    localStorage.setItem("crypto_list", JSON.stringify(crypto_list))
}

function selectCoin(coin){
    coin = coin.USD
    select_coin = {
        title: coin.FROMSYMBOL,
        price: coin.PRICE,
        img_url: "https://www.cryptocompare.com" + coin.IMAGEURL
    }
    localStorage.setItem('select_coin', JSON.stringify(select_coin))
}

function drawCoin(){
    logo_coin.src = select_coin.img_url
    title_coin.textContent = select_coin.title
    price_coin.textContent = select_coin.price + '$'
}

function drawMenuList(){
    for (let [coinKey, coinData] of Object.entries(crypto_list)) {
        let coin_clone = document.importNode(template_menu_coin.content, true);
    
        // Обновляем содержимое клонированного фрагмента
        coin_clone.querySelector("#title").textContent = coinData.USD.FROMSYMBOL;
        coin_clone.querySelector("#price").textContent = coinData.USD.PRICE;
        coin_clone.querySelector("#logo").src = "https://www.cryptocompare.com" + coinData.USD.IMAGEURL;
    
        // Находим элемент li внутри фрагмента и задаем ему id
        let li_element = coin_clone.querySelector("li");
        const id_coin = "coin-" + coinData.USD.FROMSYMBOL;
        li_element.id = id_coin;
    
        // Добавляем слушатель события на элемент li
        li_element.addEventListener('click', () => {
            console.log(coinKey);
            selectCoin(coinData);
            drawCoin();
        });
    
        // Добавляем клонированный фрагмент в меню
        menu.appendChild(coin_clone);
    }
}

function documentLoad(){
    getCryptoList();
    drawMenuList();
    checkSelectCoin();
    drawCoin();
}

function checkSelectCoin(){
    for (let [coinKey, coinData] of Object.entries(crypto_list)) {
        if(select_coin.title == coinKey){
            select_coin.price = coinData.USD.PRICE;
        }
    }
}

async function refresh(){
    await getCryptoList();

    clearMenu();
    drawMenuList();

    checkSelectCoin();
    drawCoin();
}

function clearMenu() {
    // Очищаем содержимое элемента menu
    menu.innerHTML = '';
}

//variabili globali
let linkApi='https://jsonplaceholder.typicode.com/users';
//nodo contenuto tabella
let tableRowEndpoint=document.getElementById('tableRows');
//nodo spinner loading
let loadSP=document.getElementById('loadData');
//lista con tutti i dati
let userList=[];


// api per ricezione dati
let downLoadElemnt= async ()=>{
    tableRowEndpoint.innerHTML='';
    loadSP.classList.toggle('d-none');
    try{
        let userData= await fetch(linkApi);
        loadSP.classList.toggle('d-none');
        userList= await userData.json();
        localStorage.setItem("userListJSON",JSON.stringify(userList));
    } catch(err){
        console.log("error: ",err);
        loadSP.classList.toggle('d-none');
    } 
}
let firstPage=async ()=>{
    await downLoadElemnt();
    userList.forEach(element=>{
        createRow(element);
    });
}
if(window.location.search) { //presenti parametri boolean
    let activeParams = window.location.search;
    let objParametri = new URLSearchParams(activeParams);
    //verifico se ci sono dati nell amemoria
    if(localStorage.getItem("userListJSON")){
        userList=JSON.parse(localStorage.getItem("userListJSON"));
        console.log('Dati da localStorage')
    } else {
        //memoria vuota scarico elemnti dall'API
        downLoadElemnt();
        console.log('Scaricati nuovi dati')
    }
    searchOpt(objParametri.get('branchOpt'),objParametri.get('wordSearch'));
    // carico le righe in base ai paramiti in url

}else{
    //non ci son parametri in url carico tutta i records
    firstPage();
}
//funzione creazione riga
function createRow({id,name,username,email}){
    let rowNode=document.createElement('tr');
    let scopeNode=document.createElement('th');
    scopeNode.scope='row';
    scopeNode.innerText=id;
    let nomeTemp=document.createElement('td');
    nomeTemp.innerText=name;
    let userTemp=document.createElement('td');
    userTemp.innerText=username;
    let emailTemp=document.createElement('td');
    emailTemp.innerText=email;
    rowNode.appendChild(scopeNode);
    rowNode.appendChild(nomeTemp);
    rowNode.appendChild(userTemp);
    rowNode.appendChild(emailTemp);
    tableRowEndpoint.appendChild(rowNode);
}
//funzione ricerca con opzione
function searchOpt(optSearch,inputWord){
    //passaggio tramite URL
    //altrimenti onClick su bottone e carico i dati del form per la ricerca
    let outputList=userList.filter((user)=>{
        let rowTemp=user[optSearch].toLowerCase();
        return rowTemp.includes(inputWord.toLowerCase())
    })
    //aggiungo bottone per aver la lista completa
    tableRowEndpoint.innerHTML='';
    outputList.forEach(result=>createRow(result));
    let backButton=document.createElement('button');
    backButton.type='button';
    backButton.classList.add('btn', 'btn-success');
    backButton.innerText='All Records';
    tableRowEndpoint.appendChild(backButton);
    backButton.addEventListener('click',()=>firstPage());
}
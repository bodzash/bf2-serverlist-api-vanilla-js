const API_URL = "https://api.bflist.io/bf2/v1/servers/"

let serverIp = "37.48.67.76:16571"

const container = document.querySelector(".container")
const overlay = document.querySelector(".overlay")

let name = "Default Server"
let ip = "127.0.0.1"
let port = 5000
let playersActual = 0
let players = 0
let maxPlayers = 64
let map = "Devil's Perch"
let mapSize = 64
let team1 = 0
let team2 = 0

let serverPages = 0
let serverList = []

let loading = document.querySelector(".loading")
let root = document.querySelector(".root")

requestAll() //!!!!


function requestAll() {

    fetch("https://api.bflist.io/bf2/v1/livestats")
        .then(res=>{return res.json()})
        .then(data => {
            serverPages = Math.ceil(data.servers / 50)
            renderListPerm()
            for(let i = 0; i < serverPages; i++) {
                fetch(API_URL+`${i}`)
                    .then(res => {
                        return res.json()
                    })
                    .then(data => {
                        parseSFServers(data)
                    })
            }
        })

}

function requestApi(serverIpAddress) {
    fetch(API_URL+serverIpAddress)
        .then(res => {
            return res.json()
        })
        .then(data => {
            init(data)
        })
}

function init(data) {
    name = data.name
    ip = data.ip
    port = data.port
    players = data.numPlayers
    maxPlayers = data.maxPlayers
    map = data.mapName
    mapSize = data.mapSize
    validatePlayers(data) //!!!
    render() //!!!
}

function renderListPerm() {
    let elF = document.createElement("a")
    elF.className = "refresh-list"
    elF.innerText = "REFRESH"
    elF.addEventListener("click",()=> {
        document.querySelectorAll(".server-name-wrapper").forEach(el => {
            el.remove()
        })
        elF.remove()
        elN.remove()
        requestAll()
    })
    root.append(elF)
}
function renderList(serv) {

    loading.style.display = "none"
    root.style.display = "flex"
    root.classList.add("long-list")

    let wrapper = document.createElement("div")
    wrapper.className = "server-name-wrapper"
    root.append(wrapper)

    wrapper.addEventListener("click", ()=> {
        document.querySelectorAll(".server-name-wrapper").forEach(el => {
            el.remove()
        })
        document.querySelector(".refresh-list").remove()
        requestApi(serv.ip+":"+serv.port)
    })

    let elS = document.createElement("div")
    elS.className = "server-name-list"
    elS.innerText = serv.name
    wrapper.append(elS)

    let pcw = document.createElement("div")
    pcw.className = "player-count-wrapper"
    wrapper.append(pcw)


    let el = document.createElement("div")
    el.className = "player-count"
    validatePlayers(serv)
    el.innerText = playersActual
    pcw.append(el)

    let elC = document.createElement("i")
    elC.className = "material-icons"
    elC.innerText = "perm_identity"
    pcw.append(elC)

    if (playersActual > 0) {
        el.style.color = "greenyellow"
        elS.style.color = "greenyellow"
        elC.style.color = "greenyellow"
    }

}

function render() {

    loading.style.display = "none"
    root.style.display = "flex"
    root.classList.remove("long-list")
    
    let el = document.createElement("a")
    el.className = "server-name"
    el.href = "https://www.bf2hub.com/server/"+ip+":"+port+"/"
    el.target = "_blank"
    el.innerText = name
    root.append(el)

    el = document.createElement("strong")
    el.innerText = "IP: " + ip+":"+port
    root.append(el)

    el = document.createElement("strong")
    el.innerText = "Map: " + map + " " + mapSize
    root.append(el)

    let wp = document.createElement("div")
    wp.className = "banner-wrapper"
    root.append(wp)

    let tm1 = document.createElement("p")
    if (team1 > 0) {tm1.innerText = team1}
    wp.append(tm1)

    let bn1 = document.createElement("div")
    bn1.className = "banner"
    
    wp.append(bn1)
    el = document.createElement("p")
    el.innerText = "vs"
    wp.append(el)

    let bn2 = document.createElement("div")
    bn2.className = "banner"
    wp.append(bn2)

    let tm2 = document.createElement("p")
    if (team2 > 0) {tm2.innerText = team2}
    wp.append(tm2)

    el = document.createElement("h2")
    el.innerText = "Players Online: " + (playersActual)
    if (playersActual > 0 ) {
        el.style.color = "greenyellow"
    }
    root.append(el)

    let elJ = document.createElement("a")
    elJ.className = "join"
    elJ.innerText = "COPY IP & PORT"

    elJ.addEventListener("click", ()=> {
        if (!elJ.classList.contains("join-clicked")) {
            navigator.clipboard.writeText(ip+":"+port).then(()=> {
                elJ.classList.add("join-clicked")
                elJ.innerText = "IP+Port copied to clipboard"
            })
        }
    })

    root.append(elJ)

    el = document.createElement("button")
    el.classList.add("back")
    el.classList.add("material-icons")
    el.innerText = "chevron_left"
    el.addEventListener("click", ()=> {
        root.innerHTML = ""
        requestAll()
    })
    root.append(el)

    renderBck(bn1,bn2)
}

function validatePlayers(data) {
    playersActual = 0
    team1 = 0
    team2 = 0
    data.players.forEach(player => {
        if (player.ping === 0) {
            //ignore
        } else { 
            playersActual++
            if (player.team === 1) { team1++ } else { team2++ } 
        }
    })
}

function parseSFServers(data) {
    data.forEach(serv => {
        if (serv.gameVariant === "xpack" && serv.gameType === "gpm_cq" && serv.ranked === true) {
            serverList.push(serv)
            renderList(serv)
        }
    })
}

function renderBck(bn1,bn2) {
    switch(map) {
        case "Devil's Perch":
            container.style.backgroundImage = "url('./images/maps/DevilsPerch.png')"
            overlay.style.backgroundColor = "var(--green-tp)"
            bn1.style.backgroundImage = "url('./images/icons/mecIco.png')"
            bn2.style.backgroundImage = "url('./images/icons/usaIco.png')"
        break
        case "Ghost Town":
            container.style.backgroundImage = "url('./images/maps/GhostTown.png')"
            overlay.style.backgroundColor = "var(--black-tp)"
            bn1.style.backgroundImage = "url('./images/icons/rusIco.png')"
            bn2.style.backgroundImage = "url('./images/icons/sasIco.png')"
        break
        case "The Iron Gator":
            container.style.backgroundImage = "url('./images/maps/IronGator.png')"
            overlay.style.backgroundColor = "var(--black-tp)"
            bn1.style.backgroundImage = "url('./images/icons/usaIco.png')"
            bn2.style.backgroundImage = "url('./images/icons/mecIco.png')"
        break
        case "Leviathan":
            container.style.backgroundImage = "url('./images/maps/Leviathan.png')"
            overlay.style.backgroundColor = "var(--green-tp)"
            bn1.style.backgroundImage = "url('./images/icons/usaIco.png')"
            bn2.style.backgroundImage = "url('./images/icons/mecIco.png')"
        break
        case "Mass Destruction":
            container.style.backgroundImage = "url('./images/maps/MassDestruction.png')"
            overlay.style.backgroundColor = "var(--black-tp)"
            bn1.style.backgroundImage = "url('./images/icons/rusIco.png')"
            bn2.style.backgroundImage = "url('./images/icons/rebIco.png')"
        break
        case "Night Flight":
            container.style.backgroundImage = "url('./images/maps/NightFlight.png')"
            overlay.style.backgroundColor = "var(--green-tp)"
            bn1.style.backgroundImage = "url('./images/icons/sasIco.png')"
            bn2.style.backgroundImage = "url('./images/icons/insIco.png')"
        break
        case "Surge":
            container.style.backgroundImage = "url('./images/maps/Surge.png')"
            overlay.style.backgroundColor = "var(--black-tp)"
            bn1.style.backgroundImage = "url('./images/icons/rebIco.png')"
            bn2.style.backgroundImage = "url('./images/icons/rusIco.png')"
        break
        case "Warlord":
            container.style.backgroundImage = "url('./images/maps/Warlord.png')"
            overlay.style.backgroundColor = "var(--black-tp)"
            bn1.style.backgroundImage = "url('./images/icons/insIco.png')"
            bn2.style.backgroundImage = "url('./images/icons/sasIco.png')"
        break
    }
}

/*
    +joinServer - Join a server by IP address or hostname
    +port - Used in conjunction with +joinServer to join a server
*/
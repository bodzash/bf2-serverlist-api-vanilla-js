let data = {
    succes: "true",
    data: [
        {
            name: "Maya",
            id: 0
        },
        {
            name: "Axton",
            id: 1
        },
        {
            name: "Gaige",
            id: 2
        },
        {
            name: "Zer0",
            id:3
        },
        {
            name: "Salvador",
            id:4
        },
        {
            name: "Krieg",
            id:5
        }
    ]
}

function Header() {
    return(
        <div className="header-wrapper">
            <h1>Meme Generator</h1>
            <h3>React Course - Project 3</h3>
        </div>
    )
}

function Meme() {

    const [meme, setMeme] = React.useState({topText:"", botText:"", memeName:"Default Meme Name"})

    const [allData, setAllData] = React.useState(data)

    function handleClick() {
        let rnd = Math.floor(Math.random()*(allData.data.length))
        setMeme(prevState=> {
            return {
                ...prevState,
                memeName: allData.data[rnd].name
            }
        })
    }
    

    return(
        <div className="meme-wrapper">
            <div className="inp-wrapper">
                <input className="inp1" type="text" placeholder="Top text" />
                <input className="inp2" type="text" placeholder="Bottom text" />
            </div>
            <button onClick={handleClick} className="generate-btn">Get a new meme image</button>
            <p>{meme.memeName}</p>
        </div>
    )
}

function Count() {

    const [count, setCount] = React.useState(0)

    function sub() {
        setCount(prevS => prevS - 1)
    }

    function add() {
        setCount(prevS => prevS + 1)
    }


    return (
        <div>
            <button onClick={sub}>MINUS</button>
            <div>{count}</div>
            <button onClick={add}>PLUS</button>
        </div>
    )
}

function App() {
    return(
        <div className="container">
            <Header />
            <Meme />
            <Count />
        </div>
    )
}

ReactDOM.render(<App />,document.querySelector("#root"))
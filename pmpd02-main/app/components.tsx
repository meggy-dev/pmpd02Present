function capitalise(str: string) {
    return str.charAt(0).toUpperCase() + str.substring(1).toLowerCase()
}

export function Circle({colour}: {colour: string}) {
    // tailwind does not like it when you dynamically assign colours
    if (colour == "red") {
        return ( <span className={`px-4 mx-2 bg-red-500 rounded-full`}></span> )
    } else if (colour == "amber") {
        return ( <span className={`px-4 mx-2 bg-amber-500 rounded-full`}></span> )
    } else if (colour == "green") {
        return ( <span className={`px-4 mx-2 bg-green-500 rounded-full`}></span> )
    } else {
        return ( <span className={`px-4 mx-2 bg-gray-500 rounded-full`}></span> )
    }
}

export function Header({title}: {title: string}) {
    return (
        <section>
            <div className="hidden lg:flex">
                <div className="absolute top-0 left-0 right-0 h-24 bg-white origin-top-left transform -skew-y-2"></div>
            
                <div className="absolute top-6 left-8 z-10 flex items-center gap-2">
                    <img src="/logo.png" alt="Logo" className="h-12"/>
                    <p className="text-4xl text-black">{title}</p>
                </div>
                <span className="h-[10vh]"></span>
            </div>
            <h1 className="lg:hidden text-center font-bold text-6xl py-8 h-1em">{title}</h1>
        </section>
    )
}

export function Task({name, time, severity}: {name: string, time: string, severity: string}) {
    severity = capitalise(severity)
    time = capitalise(time)
    name = capitalise(name)
    let colour = "gray"
    if (severity == "Low") {
        colour = "green"
    } else if (severity == "Medium") {
        colour = "amber"
    } else if (severity == "High") {
        colour = "red"
    }
    return (
        <div className="flex bg-blue-100 m-2 rounded-4xl min-w-[95%] p-4 text-black overflow-x-clip">
            <input type="checkbox" className="size-15 rounded-xl bg-indigo-500 hover:bg-indigo-400 cursor-pointer"/>
            <div className="inline w-full">
                <table className="w-full text-left mx-8">
                    <tbody>
                        <tr><td className="font-bold">{name}</td></tr>
                        <tr>
                            <td className="w-[50%]"><p>📆 {time}</p></td>
                            <td>
                                <Circle colour={colour} />
                                <span>{severity}</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}
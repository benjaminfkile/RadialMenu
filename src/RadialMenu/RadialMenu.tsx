import { FunctionComponent, useState } from "react"
import "./RadialMenu.css"

interface Props {
}

const items = [
    { title: "User Administration", icon: "admin_panel_settings", callback: () => console.log("User Administration") },
    { title: "bar", icon: "settings", callback: () => console.log("settings") },
    { title: "baz", icon: "face", callback: () => console.log("face") },
    { title: "moo", icon: "pets", callback: () => console.log("pets") },
    { title: "foo2", icon: "lightbulb", callback: () => console.log("lightbulb") },
    { title: "bar2", icon: "star", callback: () => console.log("star") },
    { title: "baz2", icon: "visibility", callback: () => console.log("visibility") },
    { title: "moo2", icon: "shopping_cart", callback: () => console.log("shopping_cart") },
    // { title: "User Administration", icon: "admin_panel_settings", callback: () => console.log("User Administration") },
    // { title: "bar", icon: "settings", callback: () => console.log("settings") },
    // { title: "baz", icon: "face", callback: () => console.log("face") },
    // { title: "moo", icon: "pets", callback: () => console.log("pets") },
    // { title: "foo2", icon: "lightbulb", callback: () => console.log("lightbulb") },
    // { title: "bar2", icon: "star", callback: () => console.log("star") },
    // { title: "baz2", icon: "visibility", callback: () => console.log("visibility") },
    // { title: "moo2", icon: "shopping_cart", callback: () => console.log("shopping_cart") },

]

const RadialMenu: FunctionComponent<Props> = () => {
    const [hoverDex, setHoverDex] = useState(-1)
    const diameter = 500

    const hoverFill = "#dc3545"


    const innerDiameter = diameter - 100
    const radius = diameter / 2
    const innerRadius = innerDiameter / 2
    const iconRadius = innerRadius * 0.7
    const lowerTextRadius = radius - 33.33 // 50 pixels inward
    const upperTextRadius = radius - 30
    const segmentAngle = 360 / items.length
    const wheelOffset = items.length > 3 ? -(diameter / items.length) / 3 : -segmentAngle / 2

    const handleHover = (index: number) => {
        if (hoverDex !== index) {
            setHoverDex(index)
        }
    }

    return (
        <div
            className="RadialMenu"
            style={{
                width: `${diameter}px`,
                height: `${diameter}px`,
                transform: `rotate(${wheelOffset}deg)`
            }}
            onMouseLeave={() => handleHover(-1)}
        >
            <div className="RadialMenuCrust">
                <svg
                    width={`${diameter}px`}
                    height={`${diameter}px`}
                    viewBox={`0 0 ${diameter} ${diameter}`}
                >
                    {items.map((item, index) => {
                        const angleDeg = index * segmentAngle + segmentAngle / 2 - 90
                        const startAngle = (angleDeg - segmentAngle / 2) * Math.PI / 180
                        const endAngle = (angleDeg + segmentAngle / 2) * Math.PI / 180
                        const midAngle = (startAngle + endAngle) / 2
                        const isUpsideDown = Math.sin(midAngle) > 0;
                        const dTextPath = isUpsideDown
                            ? `M${radius + lowerTextRadius * Math.cos(endAngle)},${radius + lowerTextRadius * Math.sin(endAngle)} A${lowerTextRadius},${lowerTextRadius} 0 0,0 ${radius + lowerTextRadius * Math.cos(startAngle)},${radius + lowerTextRadius * Math.sin(startAngle)}`
                            : `M${radius + upperTextRadius * Math.cos(startAngle)},${radius + upperTextRadius * Math.sin(startAngle)} A${upperTextRadius},${upperTextRadius} 0 0,1 ${radius + upperTextRadius * Math.cos(endAngle)},${radius + upperTextRadius * Math.sin(endAngle)}`;


                        const fill = hoverDex === index ? "#dc3545" : "#eaeaea"

                        return (
                            <g
                                key={index}
                                onClick={item.callback}
                                onMouseEnter={() => handleHover(index)}
                            >
                                <path
                                    id={`path-${index}`}
                                    d={`M${radius},${radius} L${radius + radius * Math.cos(startAngle)},${radius + radius * Math.sin(startAngle)} A${radius},${radius} 0 0,1 ${radius + radius * Math.cos(endAngle)},${radius + radius * Math.sin(endAngle)} Z`}
                                    fill={fill}
                                    stroke="black"
                                    strokeWidth="2"

                                />
                                <path
                                    id={`text-path-${index}`}
                                    d={dTextPath}
                                    fill="none"
                                    stroke="none"

                                />
                                <text
                                    fontSize="18"
                                    fill="black"
                                    textAnchor="middle"
                                    dominantBaseline={isUpsideDown ? "hanging" : "middle"}

                                >
                                    <textPath
                                        xlinkHref={`#text-path-${index}`}
                                        startOffset="50%"

                                    >
                                        {item.title}
                                    </textPath>
                                </text>
                            </g>
                        )
                    })}
                </svg>
            </div>

            <div className="RadialMenuPie"
                style={{
                    margin: `${(diameter - innerDiameter) / 2}px`
                }}
            >
                <svg
                    width={`${innerDiameter}px`}
                    height={`${innerDiameter}px`}
                    viewBox={`0 0 ${innerDiameter} ${innerDiameter}`}
                >
                    {items.map((item, index) => {

                        const angleDeg = index * segmentAngle + segmentAngle / 2 - 90
                        const iconAngle = angleDeg * Math.PI / 180
                        const fill = hoverDex === index ? "#dc3545" : "#eaeaea"

                        return (
                            <g key={index} onClick={item.callback}
                                onMouseEnter={() => handleHover(index)}
                            >
                                <path
                                    d={`M${innerRadius},${innerRadius} L${innerRadius + innerRadius * Math.cos((angleDeg - segmentAngle / 2) * Math.PI / 180)},${innerRadius + innerRadius * Math.sin((angleDeg - segmentAngle / 2) * Math.PI / 180)} A${innerRadius},${innerRadius} 0 0,1 ${innerRadius + innerRadius * Math.cos((angleDeg + segmentAngle / 2) * Math.PI / 180)},${innerRadius + innerRadius * Math.sin((angleDeg + segmentAngle / 2) * Math.PI / 180)} Z`}
                                    fill={fill}
                                    stroke="black"
                                    strokeWidth="2"
                                />
                                <foreignObject
                                    x={(innerRadius + iconRadius * Math.cos(iconAngle)) - 24}
                                    y={(innerRadius + iconRadius * Math.sin(iconAngle)) - 24}
                                    width="48px"
                                    height="48px"
                                >
                                    <span className="material-icons"
                                        style={{
                                            fontSize: "48px",
                                            transform: `rotate(${-wheelOffset}deg)`
                                        }}
                                    >
                                        {item.icon}
                                    </span>
                                </foreignObject>
                            </g>
                        )
                    })}
                </svg>
            </div>
            <div
                className="RadialMenuCore"
                onMouseEnter={() => handleHover(-1)}
                style={{
                    width: `${radius / 2}px`,
                    height: `${radius / 2}px`,
                    top: `${(diameter / 2) - ((radius / 2) / 2)}px`,
                    left: `${(diameter / 2) - ((radius / 2) / 2)}px`,
                }}
            >
                <span
                    className="material-icons"
                    style={{
                        fontSize: `${radius / 2}px`,
                        transform: `rotate(${-wheelOffset}deg)`
                    }}
                >settings</span>
            </div>
        </div>
    )
}

export default RadialMenu

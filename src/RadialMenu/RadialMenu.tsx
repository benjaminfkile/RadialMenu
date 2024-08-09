import { FunctionComponent, useState, useEffect, useRef } from "react";
import "./RadialMenu.css";

interface Props { }

const items = [
    { title: "User Administration", icon: "admin_panel_settings", callback: () => console.log("User Administration") },
    { title: "bar", icon: "settings", callback: () => console.log("settings") },
    { title: "baz", icon: "face", callback: () => console.log("face") },
    { title: "moo", icon: "pets", callback: () => console.log("pets") },
    { title: "foo2", icon: "lightbulb", callback: () => console.log("lightbulb") },
    { title: "bar2", icon: "star", callback: () => console.log("star") },
    { title: "baz2", icon: "visibility", callback: () => console.log("visibility") },
    { title: "moo2", icon: "shopping_cart", callback: () => console.log("shopping_cart") },
];

const RadialMenu: FunctionComponent<Props> = () => {
    const [hoverDex, setHoverDex] = useState(-1);
    const diameter = 500;
    const svgPieRef = useRef<SVGSVGElement>(null);
    const svgCoreRef = useRef<SVGSVGElement>(null);

    const hoverFill = "#dc3545";

    const innerDiameter = diameter - 100;
    const radius = diameter / 2;
    const innerRadius = innerDiameter / 2;
    const iconRadius = innerRadius * 0.7;
    const lowerTextRadius = radius - 33.33;
    const upperTextRadius = radius - 30;
    const segmentAngle = 360 / items.length;
    const wheelOffset = items.length > 3 ? -(diameter / items.length) / 3 : -segmentAngle / 2;

    const handleMouseMove = (event: MouseEvent) => {
        if (!svgPieRef.current || !svgCoreRef.current) return;

        const svg = svgPieRef.current;
        const point = svg.createSVGPoint();
        point.x = event.clientX;
        point.y = event.clientY;

        const cursorPoint = point.matrixTransform(svg.getScreenCTM()?.inverse());

        const dx = cursorPoint.x - radius;
        const dy = cursorPoint.y - radius;
        const distanceFromCenter = Math.sqrt(dx * dx + dy * dy);

        // Check if the cursor is inside the core circle
        if (distanceFromCenter <= radius / 4) {
            setHoverDex(-1);
            return;
        }

        let foundSegment = -1;

        items.forEach((_, index) => {
            //@ts-ignore
            const path = document.getElementById(`path-${index}`) as SVGGeometryElement;
            if (path.isPointInFill(cursorPoint)) {
                foundSegment = index;
            }
        });

        setHoverDex(foundSegment);
    };

    useEffect(() => {
        document.addEventListener("mousemove", handleMouseMove);
        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
        };
    }, []);

    return (
        <div
            className="RadialMenu"
            style={{
                width: `${diameter}px`,
                height: `${diameter}px`,
                transform: `rotate(${wheelOffset}deg)`,
                position: "relative",
            }}
        >
            <div className="RadialMenuCrust" onMouseLeave={() => setHoverDex(-1)}>
                <svg
                    ref={svgPieRef}
                    width={`${diameter}px`}
                    height={`${diameter}px`}
                    viewBox={`0 0 ${diameter} ${diameter}`}
                >
                    {items.map((item, index) => {
                        const angleDeg = index * segmentAngle + segmentAngle / 2 - 90;
                        const startAngle = (angleDeg - segmentAngle / 2) * Math.PI / 180;
                        const endAngle = (angleDeg + segmentAngle / 2) * Math.PI / 180;
                        const midAngle = (startAngle + endAngle) / 2;
                        const isUpsideDown = Math.sin(midAngle) > 0;
                        const dTextPath = isUpsideDown
                            ? `M${radius + lowerTextRadius * Math.cos(endAngle)},${radius + lowerTextRadius * Math.sin(endAngle)} A${lowerTextRadius},${lowerTextRadius} 0 0,0 ${radius + lowerTextRadius * Math.cos(startAngle)},${radius + lowerTextRadius * Math.sin(startAngle)}`
                            : `M${radius + upperTextRadius * Math.cos(startAngle)},${radius + upperTextRadius * Math.sin(startAngle)} A${upperTextRadius},${upperTextRadius} 0 0,1 ${radius + upperTextRadius * Math.cos(endAngle)},${radius + upperTextRadius * Math.sin(endAngle)}`;

                        const fill = hoverDex === index ? hoverFill : "#eaeaea";

                        return (
                            <g
                                key={index}
                                onClick={item.callback}
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
                        );
                    })}
                </svg>
            </div>

            <div
                className="RadialMenuPie"
                style={{
                    margin: `${(diameter - innerDiameter) / 2}px`,
                }}
            >
                <svg
                    width={`${innerDiameter}px`}
                    height={`${innerDiameter}px`}
                    viewBox={`0 0 ${innerDiameter} ${innerDiameter}`}
                >
                    {items.map((item, index) => {
                        const angleDeg = index * segmentAngle + segmentAngle / 2 - 90;
                        const iconAngle = angleDeg * Math.PI / 180;
                        const fill = hoverDex === index ? hoverFill : "#eaeaea";

                        return (
                            <g
                                key={index}
                                onClick={item.callback}
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
                                    <span
                                        className="material-icons"
                                        style={{
                                            fontSize: "48px",
                                            transform: `rotate(${-wheelOffset}deg)`,
                                        }}
                                    >
                                        {item.icon}
                                    </span>
                                </foreignObject>
                            </g>
                        );
                    })}
                </svg>
            </div>
            <svg
                id="cb2e6dad4cda41bca879ab6cac9c053d"
                ref={svgCoreRef}
                width={`${diameter}px`}
                height={`${diameter}px`}
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                }}
                viewBox={`0 0 ${diameter} ${diameter}`}
            >
                <path
                    d={`
            M ${radius},${radius}
            m -${radius / 4}, 0
            a ${radius / 4},${radius / 4} 0 1,0 ${radius / 2},0
            a ${radius / 4},${radius / 4} 0 1,0 -${radius / 2},0
        `}
                    fill={"#FFFFFF"}
                    stroke="black"
                    strokeWidth="2"
                />
                <foreignObject
                    id="safdasdfasf"
                    x={radius - radius / 4}  // Center by subtracting half of the core's radius
                    y={radius - radius / 4}  // Center by subtracting half of the core's radius
                    width={radius / 2}       // Set width to the core's diameter
                    height={radius / 2}      // Set height to the core's diameter
                >
                    <span
                        className="material-icons"
                        style={{
                            fontSize: `${radius / 2}px`,  // Set the font size to match the core's diameter
                            display: "block",             // Make the span fill the foreignObject
                            width: "100%",                // Ensure the span fills the width
                            height: "100%",               // Ensure the span fills the height
                            textAlign: "center",          // Center the icon horizontally
                            lineHeight: `${radius / 2}px`, // Center the icon vertically
                        }}
                    >
                        settings
                    </span>
                </foreignObject>
            </svg>

        </div>
    );
};

export default RadialMenu;

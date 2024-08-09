import { FunctionComponent, useState, useEffect, useRef } from "react";
import "./RadialMenu.css";
import MenuItem from "./Interfaces/MenuItem";

interface Props {
    diameter: number
    coreIcon: string
    slices: MenuItem[]
}

const RadialMenu: FunctionComponent<Props> = (props) => {

    const { coreIcon, slices, diameter } = props

    const [hoverDex, setHoverDex] = useState(-1);
    const svgPieRef = useRef<SVGSVGElement>(null);
    const svgCoreRef = useRef<SVGSVGElement>(null);

    const hoverFill = "#dc3545";

    const innerDiameter = diameter - 100;
    const radius = diameter / 2;
    const innerRadius = innerDiameter / 2;
    const iconRadius = innerRadius * 0.7;
    const lowerTextRadius = radius - 33.33;
    const upperTextRadius = radius - 30;
    const segmentAngle = 360 / slices.length;
    const wheelOffset = slices.length > 3 ? -(diameter / slices.length) / 3 : -segmentAngle / 2;

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

        slices.forEach((_, index) => {
            //@ts-ignore
            const path = document.getElementById(`path-${index}`) as SVGGeometryElement;
            if (path.isPointInFill(cursorPoint)) {
                foundSegment = index;
            }
        });

        setHoverDex(foundSegment);
    };

    const handleClick = () => {
        if (hoverDex > -1) {
            slices[hoverDex].callback()
        }
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
            onClick={() => handleClick()}
        >
            <div className="RadialMenuCrust" onMouseLeave={() => setHoverDex(-1)}>
                <svg
                    ref={svgPieRef}
                    width={`${diameter}px`}
                    height={`${diameter}px`}
                    viewBox={`0 0 ${diameter} ${diameter}`}
                >
                    {slices.map((item, index) => {
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
                                    fontWeight={500}
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
                    {slices.map((item, index) => {
                        const angleDeg = index * segmentAngle + segmentAngle / 2 - 90;
                        const iconAngle = angleDeg * Math.PI / 180;
                        const fill = hoverDex === index ? hoverFill : "#eaeaea";

                        return (
                            <g
                                key={index}
                            >
                                <path
                                    d={`M${innerRadius},${innerRadius} L${innerRadius + innerRadius * Math.cos((angleDeg - segmentAngle / 2) * Math.PI / 180)},${innerRadius + innerRadius * Math.sin((angleDeg - segmentAngle / 2) * Math.PI / 180)} A${innerRadius},${innerRadius} 0 0,1 ${innerRadius + innerRadius * Math.cos((angleDeg + segmentAngle / 2) * Math.PI / 180)},${innerRadius + innerRadius * Math.sin((angleDeg + segmentAngle / 2) * Math.PI / 180)} Z`}
                                    fill={fill}
                                    stroke="black"
                                    strokeWidth="2"
                                />
                                <foreignObject
                                    x={(innerRadius + iconRadius * Math.cos(iconAngle)) - (innerRadius / 4) / 2}
                                    y={(innerRadius + iconRadius * Math.sin(iconAngle)) - (innerRadius / 4) / 2}
                                    width={`${(innerRadius / 4)}`}
                                    height={`${(innerRadius / 4)}`}
                                >
                                    <span
                                        className="material-icons"
                                        style={{
                                            fontSize: `${(innerRadius / 4)}px`,
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
                    x={radius - radius / 4}
                    y={radius - radius / 4}
                    width={radius / 2}
                    height={radius / 2}
                >
                    <span
                        className="material-icons"
                        style={{
                            fontSize: `${radius / 2}px`,
                            display: "block",
                            width: "100%",
                            height: "100%",
                            textAlign: "center",
                            lineHeight: `${radius / 2}px`,
                            transform: `rotate(${-wheelOffset}deg)`,
                        }}
                    >
                        {coreIcon}
                    </span>
                </foreignObject>
            </svg>

        </div>
    );
};

export default RadialMenu;

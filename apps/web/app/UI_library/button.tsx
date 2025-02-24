import React from "react";

interface ButtonProps {
    variant: "small" | "large";
    onClick: () => void;
    text: string;
}

const variantStyles: Record<"small" | "large", string> = {
    small: "px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer",
    large: "w-full max-w-xs py-2 bg-blue-500 hover:bg-blue-600 text-white text-lg rounded-xl transition duration-300 cursor-pointer"
};

export default function Button(props: ButtonProps) {
    return (
        <button className={variantStyles[props.variant]} onClick={props.onClick}>
            {props.text}
        </button>
    );
}

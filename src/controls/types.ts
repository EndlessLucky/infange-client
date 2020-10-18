import React from "react";

export type BaseInputProps = {
    full?: boolean,
    errorMessage?: string,
    ref: ((instance: (HTMLInputElement | null)) => void) | React.MutableRefObject<HTMLInputElement | null> | null
}
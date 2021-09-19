import {Children, cloneElement, isValidElement, ReactElement} from "react";
import replaceChildren from "./replaceChildren";

const filterChildren = (el: ReactElement, fn: (child: ReactElement)=>boolean) =>
     replaceChildren(el, child=>!fn(child), ()=>undefined)

export default filterChildren
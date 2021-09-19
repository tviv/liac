import {Children, cloneElement, isValidElement, ReactElement, ReactNode} from "react";

const replaceChildren =  ((
    el: ReactElement,
    checkFn: (child: ReactElement)=> boolean,
    replaceFn:(child: ReactElement)=> ReactNode | undefined
) => {
    return replaceInner(el)

    function replaceInner(el: ReactElement): ReactNode | undefined {
        if (checkFn(el)) return replaceFn(el)

        if (el.props && el.props.children) {

            const c = Children.map(el.props.children, x => isValidElement(x) ? replaceInner(x) : x)

            return cloneElement(el, el.props, c.length > 1 ? c : c.shift())
        }
        else {
            return el
        }
    }


})

export default replaceChildren
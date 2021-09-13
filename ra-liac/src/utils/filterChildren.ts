import {Children, cloneElement, isValidElement, ReactElement} from "react";

const filterChildren =  ((el: ReactElement, fn: (child: ReactElement)=>boolean) => {
    if (!fn(el)) return undefined

    if (el.props && el.props.children) {

        const c = Children.toArray(el.props.children)
            .reduce((a: any[], x) => {
                const r = isValidElement(x) ? filterChildren(x, fn) : x
                if (r) a.push(r)
                return a
            }, [])

        return cloneElement(el, el.props, c.length > 1 ? c : c.shift())
    }
    else {
        return el
    }

})

export default filterChildren
import React from "react";
import {shallow} from 'enzyme';
import replaceChildren from "./replaceChildren";

describe('replaceChildren', () => {
  it('test 1', () => {
    const el = (<div><p>text</p><p>script1</p><div><p>text2</p><p>script2</p></div></div>)

    const result = replaceChildren(el,
            child => child.type === 'div',
            child=>(<span>{child}</span>)
    )

    //expect(shallow(result).matchesElement(<span><div><p>text</p><p>script1</p><p>text</p><div><p>text2</p><p>script2</p></div></div></span>)).toEqual(true)
    expect(result).toEqual(<span><div><p>text</p><p>script1</p><div><p>text2</p><p>script2</p></div></div></span>)

  })
  it('test 2', () => {
    const el = (<div><p>text</p><p>script1</p><div><p>text2</p><p>script2</p></div></div>)

    const result = replaceChildren(el,
        child => child.type === 'p',
        child=>(<span>{child}</span>)
    )

    expect(shallow(result).matchesElement(<div><span><p>text</p></span><span><p>script1</p></span><div><span><p>text2</p></span><span><p>script2</p></span></div></div>)).toEqual(true)

  })
})
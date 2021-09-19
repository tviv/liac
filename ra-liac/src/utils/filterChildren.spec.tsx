import filterChildren from "./filterChildren";
import React from "react";
import {shallow} from 'enzyme';

describe('filterChildren', () => {
  it('test 1', () => {
    const el = (<div><p>text</p><p>script1</p><p>text</p><div><p>text2</p><p>script2</p></div></div>)

    const result = filterChildren(el, child => {
      return typeof child.props?.children !== 'string' || child.props.children.includes('script')
    })

    expect(shallow(result).matchesElement(<div><p>script1</p><div><p>script2</p></div></div>)).toBeTruthy()

  })
  it('test 2', () => {
    const el = (<div>text<p>text</p><p>script1</p><p>text</p><div><p>text2</p><p>script2</p></div></div>)

    const result = filterChildren(el, child => {
      return typeof child.props?.children !== 'string' || child.props.children.includes('text')
    })

    expect(shallow(result).matchesElement(<div>text<p>text</p><p>text</p><div><p>text2</p></div></div>)).toBeTruthy()
  })
})
import React from 'react'

const DEFAULT_VALUE = {}

export const withContext = (Component, getRef = false) => {
  class EnhancedComponent extends React.Component {
    render () {
      return (
        <Context.Consumer>
          {
            context =>
              getRef
                ? <Component ref={input => { this.innerComponent = input }} context={context} {...this.props} />
                : <Component context={context} {...this.props} />
          }
        </Context.Consumer>
      )
    }
  }
  EnhancedComponent.navigationOptions = Component.navigationOptions
  return EnhancedComponent
}

export const Context = React.createContext(DEFAULT_VALUE)

import React, { Component } from "react";
import { Redirect } from "react-router-dom";

let ValidatedRoute = ComposedComponent => class extends Component {
    state = {
        isValid: true
    }

    async componentDidMount() {
        this.setState({
            isValid: await this.props.validator(this.props.match.params.id)
        })
    }

    render() {
        if (!this.state.isValid) {
            return <Redirect to={{
                pathname: this.props.redirect,
                state: { from: this.props.location }
            }}/>
        }
        return <ComposedComponent {...this.props} />
    }
}

export default ValidatedRoute;
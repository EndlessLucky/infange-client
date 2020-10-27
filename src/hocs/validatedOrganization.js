import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { connect } from 'react-redux'
import {activeOrganization, getOrganization} from "../actions/organization";

let ValidatedOrganization = ComposedComponent => connect(mapStateToProps, mapDispatchToProps)(class extends Component {
    state = {
        isValid: true,
        isPending: false,
    }

    async componentDidMount() {
        let orgs = await this.props.getOrganizations();
        let org = this.props.organizations.byID[this.props.match.params.organizationID];
        if(org && org._id !== this.props.organizations.activeID) {
            this.props.setActive(org);
        }
        // else {
        //     this.props.setActive(orgs.byID[0]);
        // }
    }

    render() {
        const {activeID, byID} = this.props.organizations;
        const newProps = {...this.props, activeID: this.props.organizations.activeID};
        if (activeID && this.props.organizations.allIDs.length && !byID[this.props.match.params.organizationID]) {
            return <Redirect to={{
                pathname: `/${activeID}/Dashboard`,
                state: { from: this.props.location }
            }}/>
        }
        else if(!this.props.organizations.allIDs.length) {
            return null;
        }
        return <ComposedComponent {...newProps} />
    }


})

const mapStateToProps = state => {
    return {organizations: state.organizations};
}

const mapDispatchToProps = dispatch => ({
    setActive: org => dispatch(activeOrganization(org)),
    getOrganizations: () => dispatch(getOrganization())
})

export default ValidatedOrganization;
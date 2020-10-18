
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createUser } from "../../actions/user";
import { SaveButton} from '../../components/controls/Button';
import UserFields from './Fields';

class CreateUser extends Component {
    state = {
        firstName: '',
        lastName: '',
        nickName: '',
        address: {
            street: '',
            city: '',
            state: ''
        },
        email: '',
        loading : false,
        organizationID: ''
    }

    handleChange = (e) => {
        this.setState({[e.target.name]: e.target.value});
    }

    returnMain = () => {
        const {history, match: {path}} = this.props;
        history.push(path.split('/Add')[0])
    }

    handleSave = async () => {
        try {
            this.setState({loading: true});
            await this.props.create({...this.state,
                contact: { type: 'email', info: this.state.email},
                organizationID: this.props.organizationID});
            this.returnMain();
        }
        catch(err) {
            this.setState({loading: false});
        }
    }

    render() {
        const { firstName, lastName, nickName, street, city, state, email, loading } = this.state;
        return (
            <div>
                <UserFields
                    onChange={this.handleChange}
                    firstName={firstName}
                    lastName={lastName}
                    nickName={nickName}
                    street={street}
                    city={city}
                    state={state}
                    email={email}
                >
                <SaveButton color="primary" onClick={this.handleSave} isLoading={loading} />
                </UserFields>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {organizationID: state.organizations.activeID};
};

const mapDispatchToProps = dispatch => ({
    create: (user) => dispatch(createUser(user))
});

export default connect(mapStateToProps, mapDispatchToProps) (CreateUser);
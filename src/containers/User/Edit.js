import React, { PureComponent }  from 'react';
import { connect } from 'react-redux';
import {editUser} from "../../actions/user";
import { SaveButton} from '../../components/controls/Button';
import UserFields from './Fields';

class Edit extends PureComponent {
    state = {
        loading: true,
        pending: false
    }

    handleChange = (e) => {
        this.setState({[e.target.name]: e.target.value});
    }

    returnMain = () => {
        const {history, match: {path}} = this.props;
        history.push(path.split('/Edit')[0])
    }

    handleSave = async () => {
        try {
            this.setState({pending: true});
            const user = {...this.state};
            delete user.loading;
            delete user.pending;
            user.contact = user.contact.map(x =>
                x.type === 'email' ? {...x, info: user.email} : x
            );

            delete user.email;
            await this.props.update(user);
            this.returnMain();

        }
        catch(err) {
            this.setState({pending: false});
        }
    }

    render() {
        const { firstName, lastName, nickName, street, city, state, email, loading, pending } = this.state;
        return (
            loading ? null :
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
                        <SaveButton color="primary" onClick={this.handleSave} isLoading={pending}/>
                    </UserFields>
                </div>
        )
    }

    componentWillReceiveProps(p) {
        const {match: {params: {id}}, byID} = p;
        const user = {...byID[id]};
        if(user._id && user._id !== this.state._id) {
            const emailContact = user.contact.find(x => x.type === 'email');
            user.email = emailContact ? emailContact.info : '';
            this.setState({...user, loading: false});
        }
    }

    componentDidMount() {
        const {match: {params: {id}}, byID} = this.props;
        const user = {...byID[id]};
        if(user._id) {
            const emailContact = user.contact.find(x => x.type === 'email');
            user.email = emailContact ? emailContact.info : '';
            this.setState({...user, loading: false});
        }
    }
}

const mapStateToProps = state => {
    return state.users;
}

const mapDispatchToProps = dispatch => ({
    update: (user) => dispatch(editUser(user))
})

export default connect(mapStateToProps, mapDispatchToProps)(Edit);
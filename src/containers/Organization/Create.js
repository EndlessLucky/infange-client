import React, {Component} from 'react';
import TextBox from '../../controls/TextField';
import {SaveButton} from '../../components/controls/Button';
import {connect} from 'react-redux';
import {createOrganization} from "../../actions/organization";

// TODO: Allow for settings
class CreateOrganization extends Component {
    state = {
        name: '',
        loading: false,
    }

    handleChange = (e) => {
        this.setState({[e.target.name]: e.target.value})
    }

    handleEnter = (e) => {
        e.preventDefault();
        return false;
    }

    handleSave = async () => {
        try {
            this.setState({loading: true});
            await this.props.create({name: this.state.name});
        }
        catch(err) {
            console.log(err);
        }
        finally {
            this.setState({loading: false});
        }
    }

    render() {
        const { name, loading } = this.state;
        return (
            <div>
                <form onSubmit={this.handleEnter}>
                    <TextBox
                        label="Organization Name"
                        name="name"
                        onChange={this.handleChange}
                        inputProps={{maxLength: 30}}
                        value={name} />
                    <SaveButton
                        color="secondary"
                        onClick={this.handleSave}
                        isLoading={loading}
                        type="submit"
                    />
                </form>
            </div>
        )
    }
}

const mapDispatchToProps = dispatch => ({
    create: (org) => dispatch(createOrganization(org))
})

export default connect(null, mapDispatchToProps)(CreateOrganization);

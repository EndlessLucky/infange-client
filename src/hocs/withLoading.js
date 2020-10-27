import React from 'react';
import Loading from '../components/controls/Loading';

function WithLoading(Component) {
    return function WithLoadingComponent({ isLoading, loadingSize=20, ...props }) {
        if (!isLoading) return (<Component {...props} />);
        return <Loading size={loadingSize} styles={{width: '100%', height: '100%'}}><Component {...props} /></Loading>;
    }
}
export default WithLoading;
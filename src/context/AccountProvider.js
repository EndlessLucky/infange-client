import { createContext, useEffect, useState, useContext } from "react";
import React from "react";
import axios from "axios";
import { getSocketInstance } from "../socket";
import store from "../store";
import { getNotifications } from "../actions/notification";
import { register } from "../registerServiceWorker";

export const AccountContext = createContext();

export async function getAccountUsers() {
  const res = await axios.get("/api/account/users/current");
  return res.data;
}

export const useAccount = () => {
  const { account, getAccount } = useContext(AccountContext);

  useEffect(() => {
    if (!account.isLoading && !account.data) {
      getAccount();
    }
  }, [null]);

  return [account, getAccount];
};

export const AccountHOC = (Comp) =>
  class HOC extends React.Component {
    static contextType = AccountContext;
    componentDidMount() {
      if (!this.context.isLoading && !this.context.account.data) {
        this.context.getAccount();
      }
    }
    render() {
      return <Comp {...this.props} account={this.context.account.data || []} />;
    }
  };

let globalLoading = false;
let request = null;

const Provider = (props) => {
  const [loading, setLoading] = useState(globalLoading);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  async function makeRequest() {
    if (loading && request) {
      setData(await request);
    } else {
      try {
        globalLoading = true;
        setLoading(globalLoading);
        request = getAccountUsers();
        setData(await request);
      } catch (err) {
        setError(error);
      } finally {
        globalLoading = false;
        setLoading(globalLoading);
      }
    }
  }

  useEffect(() => {
    if (data && data.length) {
      getSocketInstance().emit("join_room", data[0]._id);
      store.dispatch(getNotifications(data[0]._id));
      register();
    }
  }, [data]);

  return (
    <AccountContext.Provider
      value={{
        account: { isLoading: loading, data, error },
        getAccount: makeRequest,
      }}
      {...props}
    />
  );
};

export default React.memo(Provider);

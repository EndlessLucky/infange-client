import { createContext, useEffect, useState, useContext } from "react";
import React from "react";
import axios from "axios";

export const OrganizationContext = createContext();

export async function getOrganizations() {
  const res = await axios.get("/api/organizations");
  return res.data;
}

export const useOrganizations = () => {
  const { organizations, getOrganizations } = useContext(OrganizationContext);

  useEffect(() => {
    if (!organizations.isLoading && !organizations.data) {
      getOrganizations();
    }
  }, [null]);

  return [organizations, getOrganizations];
};

export const OrganizationHOC = (Comp) =>
  class HOC extends React.Component {
    static contextType = OrganizationContext;
    componentDidMount() {
      if (!this.context.isLoading && !this.context.organizations.data) {
        this.context.getOrganizations();
      }
    }
    render() {
      return (
        <Comp
          {...this.props}
          organizations={this.context.organizations.data || []}
        />
      );
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
        request = getOrganizations();
        setData(await request);
      } catch (err) {
        setError(error);
      } finally {
        globalLoading = false;
        setLoading(globalLoading);
      }
    }
  }

  return (
    <OrganizationContext.Provider
      value={{
        organizations: { isLoading: loading, data, error },
        getOrganizations: makeRequest,
      }}
      {...props}
    />
  );
};

export default React.memo(Provider);

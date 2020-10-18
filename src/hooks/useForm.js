import {useState} from 'react'

const useForm = (v, callback) => {
    const [values, setValues] = useState({...v});
  
    const handleSubmit = (event) => {
      if (event) event.preventDefault();
        callback();
    };
  
    const handleChange = (event) => {
      event.persist();
      setValues(values => ({ ...values, [event.target.name]: event.target.value }));
    };

    return [
      values,
      handleChange,
      handleSubmit
    ]
  };

  export default useForm
import './styles.css';
import { useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Employee } from 'types/employee';
import { AxiosRequestConfig } from 'axios';
import { requestBackend } from 'util/requests';
import { toast } from 'react-toastify';
import Select from 'react-select';
import { Department } from 'types/department';
import { useEffect, useState } from 'react';

const Form = () => {
  const history = useHistory();

  const handleCancel = () => {
    history.push("/admin/employees");
  };

  const { register, handleSubmit, formState: { errors } } = useForm<Employee>();

  const [selectDepartments, setSelectDepartments] = useState<Department[]>([]);

  useEffect(() => {
    requestBackend({
      url: '/departments',
      withCredentials: true
    })
    .then(response => {
      setSelectDepartments(response.data);
    })
  }, []);

  const onSubmit = (formData: Employee) => {
    const data = { ...formData, department: {id: 1, name: ""} };

    const config: AxiosRequestConfig = {
      method: 'POST',
      url: '/employees',
      data: data,
      withCredentials: true
    };

    requestBackend(config)
      .then(response => {

        toast.info('Funcionário cadastrado com sucesso!');

        history.push("/admin/employees");

      })
      .catch(() => {

        toast.error('Erro ao cadastrar funcionário');

      });

  };

  return (
    <div className="employee-crud-container">
      <div className="base-card employee-crud-form-card">
        <h1 className="employee-crud-form-title">INFORME OS DADOS</h1>

        <form onSubmit={handleSubmit(onSubmit)} >
          <div className="row employee-crud-inputs-container">
            <div className="col employee-crud-inputs-left-container">

              <div className="margin-bottom-30">
                <input
                  {...register('name', {
                    required: 'Campo obrigatório'
                  })}
                  type="text"
                  className={`form-control  base-input  ${errors.name ? 'is-invalid': ''}`}
                  placeholder="Nome do funcionário"
                  name="name"
                />
                <div className="invalid-feedback  d-block">{errors.name?.message}</div>
              </div>

              <div className="margin-bottom-30">
                <input
                  {...register('email', {
                    required: 'Campo obrigatório',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'E-mail inválido'
                    }
                  })}
                  type="text"
                  className={`form-control  base-input  ${errors.email ? 'is-invalid': ''}`}
                  placeholder="Email do funcionário"
                  name="email"
                />
                <div className="invalid-feedback  d-block">{errors.email?.message}</div>
              </div>

              <div className="margin-bottom-30">
                <Select
                  options={ selectDepartments }
                  classNamePrefix="employee-crud-select"
                  getOptionLabel={(department: Department) => department.name}
                  getOptionValue={(department: Department) => String(department.id)}
                  placeholder="Departamento"
                />
              </div>
            </div>
          </div>
          <div className="employee-crud-buttons-container">
            <button
              className="btn btn-outline-danger employee-crud-button"
              onClick={handleCancel}
            >
              CANCELAR
            </button>
            <button className="btn btn-primary employee-crud-button text-white">
              SALVAR
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Form;

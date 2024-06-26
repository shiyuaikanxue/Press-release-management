import React, { useEffect, useState, useRef, useContext } from "react";
import { DeleteOutlined, ExclamationCircleFilled } from "@ant-design/icons";
import { Table, Button, Modal, Form, Input } from "antd";
import axios from "axios";
export default function NewsCategory() {
  const EditableContext = React.createContext(null);
  const { confirm } = Modal;
  const [dataSource, setDataSource] = useState([]);
  const {roleId} = JSON.parse(localStorage.getItem("token"));
  useEffect(() => {
    axios.get("/categories").then((res) => {
      setDataSource(res.data);
    });
  }, []);
  const handleConfirm = (item) => {
    confirm({
      title: "您确定要删除这项分类吗?",
      icon: <ExclamationCircleFilled />,
      content: "删除之后则无法再继续浏览该分类新闻",
      onOk() {
        handleDelete(item);
      },
      onCancel() {},
    });
  };
  const handleSave = (record) => {
    setDataSource(
      dataSource.map((item) => {
        if (item.id === record.id) {
          return {
            ...item,
            title: record.title,
            value: record.value,
          };
        }
        return item;
      })
    );
    axios.patch(`/categories?_id=${record.id}`, {
      title: record.title,
      value: record.value,
    });
  };
  const handleDelete = (item) => {
    //删除本地
    setDataSource(dataSource.filter((data) => data.id !== item.id));
    axios.delete(`/categories?_id=${item.id}`);
  };
  const columns = [
    {
      title: "ID",
      dataIndex: "_id",
      render(id,item,index) {
        return <b>{index+1}</b>;
      },
    },
    {
      title: "栏目名称",
      dataIndex: "title",
      onCell: (record) => ({
        record,
        editable: true,
        dataIndex: "title",
        title: "栏目名称",
        handleSave,
      }),
    },
    {
      title: "操作",
      render(item) {
        return (
          <div>
            <Button
              shape="circle"
              disabled={roleId !== '1'}
              danger
              icon={<DeleteOutlined />}
              onClick={() => {
                handleConfirm(item);
              }}
            />
          </div>
        );
      },
    },
  ];
  const EditableRow = ({ index, ...props }) => {
    const [form] = Form.useForm();
    return (
      <Form form={form} component={false}>
        <EditableContext.Provider value={form}>
          <tr {...props} />
        </EditableContext.Provider>
      </Form>
    );
  };
  const EditableCell = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    handleSave,
    ...restProps
  }) => {
    const [editing, setEditing] = useState(false);
    const inputRef = useRef(null);
    const form = useContext(EditableContext);
    useEffect(() => {
      if (editing) {
        inputRef.current?.focus();
      }
    }, [editing]);
    const toggleEdit = () => {
      setEditing(!editing);
      form.setFieldsValue({
        [dataIndex]: record[dataIndex],
      });
    };
    const save = async () => {
      try {
        const values = await form.validateFields();
        toggleEdit();
        handleSave({
          ...record,
          ...values,
        });
      } catch (errInfo) {}
    };
    let childNode = children;
    if (editable) {
      childNode = editing ? (
        <Form.Item
          style={{
            margin: 0,
          }}
          name={dataIndex}
          rules={[
            {
              required: true,
              message: `${title} is required.`,
            },
          ]}
        >
          <Input ref={inputRef} onPressEnter={save} onBlur={save} />
        </Form.Item>
      ) : (
        <div
          className="editable-cell-value-wrap"
          style={{
            paddingRight: 24,
          }}
          onClick={toggleEdit}
        >
          {children}
        </div>
      );
    }
    return <td {...restProps}>{childNode}</td>;
  };
  return (
    <div>
      <Table
        dataSource={dataSource}
        columns={columns}
        components={{
          body: {
            row: EditableRow,
            cell: EditableCell,
          },
        }}
        pagination={{
          pageSize: 9,
        }}
        rowKey={(item) => item.id}
      />
    </div>
  );
}

'use client'
import { Button } from '@/components/Button';
import SuccessError from '@/components/SuccessError';
import { AppContext } from '@/context/app.context';
import { api } from '@/services/api';
import { LoadingOutlined } from '@ant-design/icons';
import { Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useRouter } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
import styles from './detail.module.css';

type Params = {
    params: {
        id: number
    }
}

interface DataType {
    key: React.Key;
    name: string;
    age: number;
    address: string;
}

export default function Details({ params: { id } }: Params) {
    const [load, setLoad] = useState(true)
    const [dataSheet, setDataSheet] = useState<SheetDetail | null>(null)
    const { user, loading, setPage, setIdSheetDetail } = useContext(AppContext);
    const [error, setError] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    const router = useRouter();

    async function getDataSheet() {
        try {
            await api.request({
                method: 'GET',
                url: `/sheets/${id}`,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user?.jwtToken}`
                },
            })
                .then(({ data }) => {
                    const sheet: SheetDetail = data;
                    setDataSheet(sheet)
                })
                .catch((err) => {
                    if (err.response.data.error == 'Not Found') {
                        setErrorMessage('Folha não encontrada.')
                    }
                    setError(true)
                    console.log(err)
                })
        } catch (error: any) {
            setError(true)
            console.log(error)
        } finally {
            setLoad(false)
        }
    }

    useEffect(() => {
        if (user) {
            getDataSheet()
        }
    }, [user, loading])

    setPage('details')

    const columns: ColumnsType<DataType> = [
        {
            title: 'Descrição',
            dataIndex: 'description',
        },
        {
            title: 'Valor',
            dataIndex: 'value',
            render: (text: string) => parseFloat(text).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
        }
    ];

    const rowSelection = {
        onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        },
        getCheckboxProps: (record: DataType) => ({
            disabled: record.name === 'Disabled User',
            name: record.name,
        }),
    };


    return (
        error
            ? (
                <SuccessError
                    type={'error'}
                    title={'Solicitação Inválida!'}
                    subTitle={errorMessage}
                    buttonLink='/sheet'
                    buttonTitle='VOLTAR'
                    buttonOnClick={() => {
                        setIdSheetDetail(undefined)
                        setPage('sheet')
                        router.replace(`/sheet`)
                    }}
                />
            )
            : user === null || loading || load
                ? <LoadingOutlined style={{ marginTop: '3rem', fontSize: 24 }} spin />
                : (
                    <>
                        <h2>{dataSheet?.description}</h2>

                        <p>Balanço: {dataSheet?.balance}</p>
                        <p>Contas a pagar: {dataSheet?.totalAccountsPayable}</p>
                        <p>Contas a receber: {dataSheet?.totalAccountsReceivable}</p>

                        <div className={styles.center}>
                            <Table
                                scroll={{ x: '300px' }}
                                rowSelection={{
                                    type: 'checkbox',
                                    ...rowSelection,
                                }}
                                columns={columns}
                                dataSource={dataSheet?.accountsPayable || []}
                            />
                            <Table
                                rootClassName={styles.tableColor}                                
                                style={{ backgroundColor: '#FFF' }}
                                scroll={{ x: '300px' }}
                                rowSelection={{
                                    type: 'checkbox',
                                    ...rowSelection,
                                }}
                                columns={columns}
                                dataSource={dataSheet?.accountsReceivable || []}
                            />
                            <Button
                                title={'VOLTAR'}
                                type={undefined}
                                onClick={() => {
                                    setIdSheetDetail(undefined)
                                    setPage('sheet')
                                    router.replace(`/sheet`)
                                }}
                            />
                        </div>
                    </>
                )
    );
}

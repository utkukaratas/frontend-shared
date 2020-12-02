import React, { useCallback, useMemo, useRef, useState } from 'react'
import { Column } from 'react-table'

import { makeData, Person } from './makeData'
import { FetchDataProps, Table } from '../../src/Table/Table'
import { Link } from '../../src/Link'
import { logger } from '@hazelcast/services'

export default {
  title: 'Components/Table/Table',
  component: Table,
}

type GetColumns = {
  withFooter?: boolean
  withNameLink?: boolean
}

const getColumns = ({ withFooter = false, withNameLink = false }: GetColumns): Column<Person>[] => [
  {
    Header: 'ID',
    accessor: 'id',
    ...(withFooter && { Footer: 'ID' }),
  },
  {
    Header: 'Name',
    accessor: 'name',
    ...(withFooter && { Footer: 'Name' }),
    ...(withNameLink && {
      Cell: function Cell(row) {
        return (
          <Link href="https://hazelcast.com/" size="small">
            {row.value}
          </Link>
        )
      },
    }),
  },
  {
    Header: 'Age',
    accessor: 'age',
    ...(withFooter && {
      Footer: (info) => {
        const total = React.useMemo(() => info.rows.reduce((sum, row) => (row.values.age as Person['age']) + sum, 0), [info.rows])
        const footer = `Average Age: ${total / info.rows.length}`
        return footer
      },
    }),
    align: 'right',
  },
  {
    Header: 'Visits',
    accessor: 'visits',
    ...(withFooter && {
      Footer: (info) => {
        const total = React.useMemo(() => info.rows.reduce((sum, row) => (row.values.visits as Person['visits']) + sum, 0), [info.rows])
        const footer = `Total: ${total}`
        return footer
      },
    }),
    align: 'right',
  },
  {
    Header: 'Status',
    accessor: 'status',
    ...(withFooter && { Footer: 'Status' }),
    sortType: (rowA, rowB) => {
      const sortBy: Person['status'][] = ['single', 'complicated', 'relationship']
      const indexOfStatusA = sortBy.indexOf(rowA.values.status as Person['status'])
      const indexOfStatusB = sortBy.indexOf(rowB.values.status as Person['status'])

      if (indexOfStatusA > indexOfStatusB) {
        return -1
      }
      if (indexOfStatusA < indexOfStatusB) {
        return 1
      }
      return 0
    },
  },
]

const smallDataSet = makeData(10)
const bigDataSet = makeData(10000)

export const Basic = () => {
  const columns = useMemo(() => getColumns({}), [])

  return <Table columns={columns} data={smallDataSet} disableSortBy hidePagination />
}

export const Footer = () => {
  const columns = useMemo(() => getColumns({ withFooter: true }), [])

  return <Table columns={columns} data={smallDataSet} disableSortBy hidePagination />
}

export const ClickableRowsWithNameLink = () => {
  const columns = useMemo(() => getColumns({ withNameLink: true }), [])
  return (
    <Table
      columns={columns}
      data={smallDataSet}
      disableSortBy
      hidePagination
      onRowClick={(row) => {
        logger.log(`You just clicked row: ${row.values.name as Person['name']}`)
      }}
    />
  )
}

export const AgeColumnWithWarnings = () => {
  const columns = useMemo(() => getColumns({}), [])
  return (
    <Table
      columns={columns}
      data={smallDataSet}
      disableSortBy
      hidePagination
      getCustomCellProps={(cellInfo) => {
        if (cellInfo.column.id === 'age' && cellInfo.value < 15) {
          return { warning: 'Younger than 15' }
        }
      }}
    />
  )
}

export const Sorting = () => {
  return <Table columns={getColumns({})} data={smallDataSet} />
}

export const UncontrolledPagination = () => <Table columns={getColumns({})} data={bigDataSet} disableSortBy />

export const ControlledPagination = () => {
  // We'll start our table without any data
  const [data, setData] = useState<Person[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [pageCount, setPageCount] = useState<number>(0)
  const fetchIdRef = useRef<number>(0)

  // This will get called when the table needs new data.
  const fetchData = useCallback(({ pageSize, pageIndex }: FetchDataProps) => {
    // Give this fetch an ID
    const fetchId = ++fetchIdRef.current

    // Set the loading state
    setLoading(true)

    // Let's simulate server delay
    setTimeout(() => {
      // Only update the data if this is the latest fetch
      if (fetchId === fetchIdRef.current) {
        const startRow = pageSize * pageIndex
        const endRow = startRow + pageSize
        setData(bigDataSet.slice(startRow, endRow))
        // Since we don't have real server here, we'll fake total page count.
        setPageCount(Math.ceil(bigDataSet.length / pageSize))
        setLoading(false)
      }
    }, 750)
  }, [])

  const columns = useMemo(() => getColumns({}), [])

  return (
    <Table
      columns={columns}
      data={data}
      fetchData={fetchData}
      loading={loading}
      manualPagination
      pageCount={pageCount}
      defaultPageSize={15}
      pageSizeOptions={[5, 10, 15]}
      disableSortBy
    />
  )
}

import React, { FC, useState } from 'react'

import { Pagination, PaginationProps } from '../src/Pagination'

export default {
  title: 'Components/Pagination',
  component: Pagination,
}

const StoryBase: FC<Pick<PaginationProps, 'showPageJump'>> = ({ showPageJump }) => {
  const numberOfItems = 1000
  const [pageSize, setPageSize] = useState<number>(5)
  const pageSizeOptions = [5, 10]

  const [currentPage, setCurrentPage] = useState<number>(1)
  const pageCount = Math.ceil(numberOfItems / pageSize)
  const canPreviousPage = currentPage !== 1
  const canNextPage = currentPage !== pageCount
  const previousPage = () => {
    setCurrentPage((prevState) => prevState - 1)
  }
  const nextPage = () => {
    setCurrentPage((prevState) => prevState + 1)
  }

  return (
    <Pagination
      pageCount={pageCount}
      currentPage={currentPage}
      canPreviousPage={canPreviousPage}
      canNextPage={canNextPage}
      goToPage={setCurrentPage}
      nextPage={nextPage}
      previousPage={previousPage}
      pageSize={pageSize}
      setPageSize={setPageSize}
      pageSizeOptions={pageSizeOptions}
      numberOfItems={numberOfItems}
      showPageJump={showPageJump}
    />
  )
}

export const Default = () => <StoryBase showPageJump />

Default.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/8mVm6LTbp2Z0RaWWjTZoft/%F0%9F%90%9DHIVE---Hazelcast-Design-System?node-id=9962%3A1',
  },
}

export const WithoutPageJump = () => <StoryBase showPageJump={false} />

import { FallOutlined, RiseOutlined } from '@ant-design/icons'
import { Row,Col, Button } from 'antd'
import React, { FC } from 'react'

const ReviewSorting: FC<{highestToLowest:()=>void; lowestToHighest:()=>void}> = (props) => {
  
  return (
      <React.Fragment>
          <Row>
              <Col span={8}>
                 <h2>Sort Review: </h2> 
              </Col>
              <Col span={8}>
              <Button
                type="dashed"
                htmlType="button"
                icon={<FallOutlined />}
                onClick={props.highestToLowest}
              >
                Highest to Lowest
              </Button>
              </Col>
              <Col span={8}>
              <Button
                type="dashed"
                htmlType="button"
                icon={<RiseOutlined />}
                onClick={props.lowestToHighest}
              >
                Lowest to Highest
              </Button>
              </Col>
          </Row>
      </React.Fragment>
  )
}

export default ReviewSorting
import { Image, Paper, Stack, Text } from '@mantine/core';
import styled from '@emotion/styled';
import React from 'react';

type CardListProp = {
  title: string;
  titleIcon?: any;
  emptyImage?: string;
};

const CardList: React.FC<CardListProp> = ({ title, titleIcon: TitleIcon, emptyImage }) => {
  const imageEmpty = emptyImage ?? '/images/empty_card1.svg';

  return (
    <CardListStyled>
      <Paper p="md" shadow="md" radius="md" h="100%">
        <Stack>
          <div className="cardlist-wrapper">
            <Text className="list-title" fw={900} fz={14} c="#373d3f" ff="Open Sans, sans-serif">
              {TitleIcon && <TitleIcon size={20} className="icon" />}
              {title}
            </Text>
          </div>
          <div className="cardlist-content">
            <div className="cardlist-empty">
              <Image src={imageEmpty} alt="empty" className="empty-image" />
              <Text fz="xs" mt={7}>
                Không có bản ghi
              </Text>
            </div>
          </div>
        </Stack>
      </Paper>
    </CardListStyled>
  );
};

const CardListStyled = styled.div`
  .cardlist-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .list-title {
      display: flex;
      gap: 10px;
      align-items: center;
    }
  }

  .cardlist-content {
    min-height: calc(100vh - 550px);
    display: flex;
    justify-content: center;
    align-items: center;
    .cardlist-empty {
      text-align: center;
      .empty-image {
        width: 300px;
      }
    }
  }
`;

export default CardList;

import React from "react";
import { Card, Column, H2, Row, classNames } from "pi-ui";
import styles from "./styles.module.css";

export function RecordCard({
  title,
  titleLink,
  subtitle,
  rightHeader,
  secondRow,
  thirdRow,
  fourthRow,
  footer,
  isDimmed,
  className,
  headerClassName,
}) {
  return (
    <Card
      className={classNames(
        styles.card,
        isDimmed && styles.dimmedCard,
        className
      )}
    >
      <Row className={classNames(headerClassName)}>
        <Column xs={12} sm={12} md={7}>
          {!titleLink ? (
            <H2>{title}</H2>
          ) : (
            <H2>
              <a href={titleLink} data-link className={styles.title}>
                {title}
              </a>
            </H2>
          )}
        </Column>
        <Column xs={12} sm={12} md={5} className={styles.rightHeader}>
          {rightHeader}
        </Column>
        <Column xs={12}>
          <div className={styles.subtitle}>{subtitle}</div>
        </Column>
      </Row>
      {secondRow && <Row className={styles.secondRow}>{secondRow}</Row>}
      {thirdRow && <Row className={styles.thirdRow}>{thirdRow}</Row>}
      {fourthRow && <div className={styles.fourthRow}>{fourthRow}</div>}
      <div className={styles.footer}>{footer}</div>
    </Card>
  );
}

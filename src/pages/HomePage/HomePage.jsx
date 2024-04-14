import styles from "./HomePage.module.css";
import { useController } from "react-hook-form";
import { useCallback } from "react";
import { FormItem } from "@vkontakte/vkui";
import { Selector } from "../../components/Selector/Selector";

export const HomePage = () => {
  const {
    field: { onChange, value },
  } = useController({ name: "selected", defaultValue: { selected: [] } });

  const onChangeSelector = useCallback(
    (selected) => {
      onChange({
        selected,
      });
    },
    [onChange]
  );

  return (
    <FormItem>
      <div className={styles.homepage_container}>
        <Selector onChange={onChangeSelector} selected={value.selected} />
      </div>
    </FormItem>
  );
};

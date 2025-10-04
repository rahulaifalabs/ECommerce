import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { FormEvent } from "react";



// ✅ Type for a single form control option
interface FormControlOption {
  id: string;
  label: string;
}

type ComponentType = "input" | "select" | "textarea";

interface FormControl {
  name: string;
  label: string;
  placeholder?: string;
  type?: string; // only for input
  componentType: ComponentType;
  options?: FormControlOption[]; // only for select
  id?: string; // optional
}

// ✅ Props for CommonForm with generic for formData shape
interface CommonFormProps<T extends Record<string, any>> {
  formControls: FormControl[];
  formData: T;
  setFormData: (data: T) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  buttonText?: string;
  isBtnDisabled?: boolean;
}

function CommonForm<T extends Record<string, any>>({
  formControls,
  formData,
  setFormData,
  onSubmit,
  buttonText,
  isBtnDisabled,
}: CommonFormProps<T>) {
  function renderInputsByComponentType(controlItem: FormControl) {
    const value = formData[controlItem.name] ?? "";

    switch (controlItem.componentType) {
      case "input":
        return (
          <Input
            name={controlItem.name}
            placeholder={controlItem.placeholder}
            id={controlItem.name}
            type={controlItem.type}
            value={value}
            onChange={(e) =>
              setFormData({ ...formData, [controlItem.name]: e.target.value } as T)
            }
          />
        );

      case "select":
        return (
          <Select
            value={value}
            onValueChange={(val: string) =>
              setFormData({ ...formData, [controlItem.name]: val } as T)
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={controlItem.label} />
            </SelectTrigger>
            <SelectContent>
              {controlItem.options?.map((option) => (
                <SelectItem key={option.id} value={option.id}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case "textarea":
        return (
          <Textarea
            name={controlItem.name}
            placeholder={controlItem.placeholder}
            id={controlItem.id || controlItem.name}
            value={value}
            onChange={(e) =>
              setFormData({ ...formData, [controlItem.name]: e.target.value } as T)
            }
          />
        );

      default:
        return null;
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="flex flex-col gap-3">
        {formControls.map((control) => (
          <div className="grid w-full gap-1.5" key={control.name}>
            <Label className="mb-1">{control.label}</Label>
            {renderInputsByComponentType(control)}
          </div>
        ))}
      </div>
      <Button disabled={isBtnDisabled} type="submit" className="mt-2 w-full">
        {buttonText || "Submit"}
      </Button>
    </form>
  );
}

export default CommonForm;

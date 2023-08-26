export type authType = "email" | "username" | "password" | "bio";

export const emailRe = new RegExp("^[\\w]+@([\\w-\\.]+\\.)+[\\w]{2,4}$");
export const usernameRe = new RegExp("[\\w|ㄱ-ㅎ가-힣]");
export const passwordRe = new RegExp(
  "(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()\\-=])(?=.{8,})"
);

export const validate = (
  type: authType,
  value: string,
  setWarnFunc?: (value: string) => void
): boolean => {
  const setWarn = (value: string) => {
    if (setWarnFunc) {
      setWarnFunc(value);
    }
  };

  switch (type) {
    case "email":
      if (value.trim().length === 0) {
        setWarn("이메일을 입력하세요.");
        return false;
      } else if (!emailRe.test(value)) {
        setWarn("이메일 형식이 아닙니다.");
        return false;
      } else if (value.length > 100) {
        setWarn("이메일이 너무 길어요.");
        return false;
      }
      break;
    case "username":
      if (value.trim().length === 0) {
        setWarn("이름을 입력하세요.");
        return false;
      } else if (
        value.length < 2 ||
        value.length > 20 ||
        !usernameRe.test(value)
      ) {
        setWarn("이름은 2~20자의 영문 대/소문자, 한글, 숫자, _ 를 사용하세요.");
        return false;
      }
      break;
    case "password":
      if (value.trim().length === 0) {
        setWarn("비밀번호를 입력하세요.");
        return false;
      } else if (value.length < 8) {
        setWarn("비밀번호는 8자 이상이어야 합니다.");
        return false;
      } else if (value.length > 255) {
        setWarn("비밀번호가 너무 길다.");
        return false;
      } else if (!passwordRe.test(value)) {
        setWarn(
          "비밀번호는 영문 대/소문자, 숫자, 특수문자(!@#$%^&*()-=)를 포함해야 합니다."
        );
        return false;
      }
      break;

    case "bio":
      if (value.length > 255) {
        setWarn("너무 길어요!!!!");
        return false;
      }
  }
  return true;
};

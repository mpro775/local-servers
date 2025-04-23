// src/types/components.d.ts
declare module "@/components/common/LoadingSpinner" {
  const LoadingSpinner: React.FC;
  export default LoadingSpinner;
}

declare module "@/components/common/ErrorMessage" {
  interface ErrorMessageProps {
    message: string;
  }
  const ErrorMessage: React.FC<ErrorMessageProps>;
  export default ErrorMessage;
}

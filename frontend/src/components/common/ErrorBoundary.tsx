import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '../../ui';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  private handleGoHome = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/matches';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[70vh] flex items-center justify-center p-6">
          <div className="max-w-md w-full p-6 sm:p-8 rounded-3xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-rose-500/20 shadow-2xl text-center">
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-500 flex items-center justify-center">
              <span className="material-symbols-outlined text-3xl">error_outline</span>
            </div>

            <h2 className="text-xl font-space font-black text-slate-900 dark:text-white mb-2">
              {this.props.fallbackTitle || 'Đã xảy ra lỗi tải giao diện'}
            </h2>

            <p className="text-xs text-slate-500 dark:text-slate-400 font-space mb-6">
              Hệ thống đã tự động bảo vệ dữ liệu của bạn để tránh lỗi màn hình trắng. Bạn có thể thử tải lại hoặc quay về danh sách trận.
            </p>

            {this.state.error && (
              <div className="mb-6 p-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-[11px] font-mono text-rose-600 dark:text-rose-400 text-left overflow-x-auto max-h-24">
                {this.state.error.message}
              </div>
            )}

            <div className="flex items-center justify-center gap-3">
              <Button
                variant="secondary"
                size="sm"
                leftIcon="arrow_back"
                onClick={this.handleGoHome}
              >
                Về danh sách trận
              </Button>
              <Button
                variant="primary"
                size="sm"
                leftIcon="refresh"
                onClick={this.handleReset}
              >
                Tải lại trang
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

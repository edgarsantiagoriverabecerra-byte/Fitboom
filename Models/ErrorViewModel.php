<?php


class ErrorViewModel
{
    public ?string $requestId = null;

    public function __construct(?string $requestId = null)
    {
        $this->requestId = $requestId;
    }

    /**
     * Equivalente a la propiedad calculada ShowRequestId => !string.IsNullOrEmpty(RequestId)
     */
    public function showRequestId(): bool
    {
        return !empty($this->requestId);
    }
}
<?php

namespace App\Http\Controllers\Api;

use App\Enums\OrderStatus;
use App\Exceptions\ConflictException;
use App\Http\Controllers\Controller;
use App\Http\Requests\PlaceOrderRequest;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use App\Services\OrderService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

/** Müşteri tarafı: yalnızca kendi siparişleri. */
class OrderController extends Controller
{
    public function __construct(private readonly OrderService $orders) {}

    public function index(Request $request): AnonymousResourceCollection
    {
        $orders = $request->user()->orders()
            ->with('items.book.author')->latest('id')
            ->paginate($request->integer('per_page', 10));

        return OrderResource::collection($orders);
    }

    public function store(PlaceOrderRequest $request): JsonResponse
    {
        $order = $this->orders->place(
            $request->user(), $request->validated('items'), $request->validated('shipping_address')
        );

        return (new OrderResource($order))->response()->setStatusCode(201);
    }

    public function show(Order $order): OrderResource
    {
        $this->authorize('view', $order);

        return new OrderResource($order->load('items.book.author'));
    }

    public function cancel(Request $request, Order $order): OrderResource
    {
        $this->authorize('cancel', $order);

        if ($order->status !== OrderStatus::Pending) {
            throw new ConflictException('Yalnızca beklemedeki siparişler iptal edilebilir.');
        }

        return new OrderResource($this->orders->changeStatus($order, OrderStatus::Cancelled, $request->user()));
    }
}

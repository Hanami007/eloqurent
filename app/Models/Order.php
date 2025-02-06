<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = ['customer_id', 'total_amount', 'order_date'];

    // Define the relationship with OrderDetail model
    public function orderDetails()
    {
        return $this->hasMany(OrderDetail::class);
    }

    // Define the relationship with Customer model
    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }
}

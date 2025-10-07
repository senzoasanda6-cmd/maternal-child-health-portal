<p>Dear {{ $child->mother->name }},</p>
<p>{{ $child->name }} has missed the following vaccines:</p>
<ul>
  @foreach ($missed as $item)
    <li>{{ $item['vaccine'] }} (due at week {{ $item['due_week'] }})</li>
  @endforeach
</ul>
<p>Please visit your health center as soon as possible.</p>
<p>Best regards,<br>Your Health Team</p>